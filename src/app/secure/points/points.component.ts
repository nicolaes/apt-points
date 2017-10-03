import {Component} from '@angular/core';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';
import {Router} from '@angular/router';
import {DynamoDBService} from '../../service/ddb.service';
import {VoteService} from '../../service/vote.service';
import {IotService} from '../../service/iot.service';


export class UserPoints {
    public userId: string;
    public userName: string;
    public points: number;
    public underVote: number;
    public dragging = false;
    public panDelta = 0;
    public waitingForUpdate = false;
}

export type VoteDirection = 'up' | 'down';

@Component({
    selector: 'aws-apt-points',
    templateUrl: './points.html',
})
export class PointsComponent implements LoggedInCallback {
    public userPointsList: Array<UserPoints> = [];
    public errorMessage: string;
    SWIPE_ACTION = {LEFT: 'swipeleft', RIGHT: 'swiperight'};

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService,
                public voteService: VoteService, private _iot: IotService) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            this.ddb.getUserPoints(this.userPointsList, this.subscribeToPointUpdates);
        }
    }

    subscribeToPointUpdates = () => {
        // subscribe to websocket
        this._iot.subscribeToPointUpdates((userId: string) => {
            const updatedUser: UserPoints = this.userPointsList.find(user => user.userId === userId);
            this.ddb.updateUserPointsById(updatedUser);//.then(() => {
            //     if (updatedUser.waitingForUpdate) {
            //         updatedUser.waitingForUpdate = false;
            //     }
            // });
        });
    }

    swipe(user: UserPoints, action = this.SWIPE_ACTION.RIGHT) {
        console.log('swipe', action);
        switch (action) {
            case this.SWIPE_ACTION.RIGHT:
                this.initiateVote(user, 'up');
                break;
            case this.SWIPE_ACTION.LEFT:
                this.initiateVote(user, 'down');
                break;
        }
    }

    panStart(item: UserPoints) {
        item.dragging = true;
    }

    panEnd(item) {
        item.panDelta = 0;
        item.dragging = false;
    }

    pan(item: UserPoints, event) {
        if (item.dragging === true) {
            item.panDelta = event.deltaX;
        }
    }

    initiateVote(user: UserPoints, direction: VoteDirection) {
        user.waitingForUpdate = true;
        this.voteService.movePoint(user.userId, direction, user.underVote !== 0)
            .subscribe(this.voteSuccess(user), this.voteError(user));
    }

    voteError = (user: UserPoints) => (err: any) => {
        user.waitingForUpdate = false;
        this.errorMessage = JSON.parse(err.text());
        $('#errorModal').modal('show');
    }

    voteSuccess = (user: UserPoints) => () => {
        // Add success callback
        this.errorMessage = '';
        this._iot.publishUserUpdatedEvent(user.userId);
    }

    getUserCssClass(user: UserPoints, pointIndex: number) {
        const classes = [];
        // positive:
        return classes;
    }
}
