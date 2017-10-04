import 'web-animations-js';
import {Component, OnDestroy} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';
import {DynamoDBService} from '../../service/ddb.service';
import {VoteService} from '../../service/vote.service';
import {IotService} from '../../service/iot.service';
import {AudioService} from '../../service/audio.service';


export class UserPoints {
    public userId: string;
    public userName: string;
    public points: number;
    public underVote: number;
    public dragging = false;
    public panDelta = 0;
    public waitingForUpdate: string = null;
}

export type VoteDirection = 'up' | 'down';

@Component({
    selector: 'aws-apt-points',
    templateUrl: './points.html',
})
export class PointsComponent implements LoggedInCallback, OnDestroy {
    public userPointsList: Array<UserPoints> = [];
    public errorMessage: string;

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService,
                public voteService: VoteService, private _iot: IotService, private _audio: AudioService) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.ddb.createUser().subscribe(() => {
                this.ddb.getUserPoints(this.userPointsList, this.subscribeToPointUpdates);
            }, err => {
                this.errorMessage = 'Error creating DDB user';
            });
        }
    }

    ngOnDestroy() {
        this._iot.destroyWebSocket();
    }

    subscribeToPointUpdates = () => {
        // subscribe to websocket
        this._iot.subscribeToPointUpdates((userId: string) => {
            const updatedUser: UserPoints = this.userPointsList.find(user => user.userId === userId);
            if (!updatedUser.waitingForUpdate) {
                updatedUser.waitingForUpdate = 'any';
            }
            this.ddb.updateUserPointsById(updatedUser).then(this.userUpdated);
        });
    }

    initiateVote = (user: UserPoints, direction: VoteDirection) => {
        user.waitingForUpdate = direction;
        this.voteService.movePoint(user.userId, direction, user.underVote !== 0)
            .subscribe(this.voteSuccess(user), this.voteError(user));
    }

    voteError = (user: UserPoints) => (err: any) => {
        user.waitingForUpdate = null;
        this.errorMessage = JSON.parse(err.text());
        $('#errorModal').modal('show');

        this.ddb.updateUserPointsById(user);
    }

    voteSuccess = (user: UserPoints) => () => {
        // Add success callback
        this.errorMessage = '';
        this._iot.publishUserUpdatedEvent(user.userId);
    }

    userUpdated = ({newUser, oldUser}) => {
        newUser.waitingForUpdate = null;
        this._audio.playForUser(newUser, oldUser);
    }

    getColorClass(index) {
        const colors = ['primary', 'info', 'success', 'warning', 'danger'];
        return colors[index % 5];
    }
}
