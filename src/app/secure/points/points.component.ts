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
}

export type VoteDirection = 'up' | 'down';

@Component({
    selector: 'aws-apt-points',
    templateUrl: './points.html',
})
export class PointsComponent implements LoggedInCallback {
    public userPointsList: Array<UserPoints> = [];
    public errorMessage: string;
    SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

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
            this.ddb.updateUserPointsById(this.userPointsList, userId);
        });
    }

    swipeLeft(userId) {
        this.initiateVote(userId, 'down');
    }

    swipeRight(userId) {
        this.initiateVote(userId, 'up');
    }

    swipe(userId: string, action = this.SWIPE_ACTION.RIGHT) {
        switch (action) {
            case this.SWIPE_ACTION.RIGHT:
                this.swipeRight(userId);
                break;
            case this.SWIPE_ACTION.LEFT:
                this.swipeLeft(userId);
                break;
        }
    }

    initiateVote(userId: string, direction: VoteDirection) {
        const user = this.userPointsList.find(u => u.userId === userId);
        this.voteService.movePoint(userId, direction, user.underVote !== 0)
            .subscribe(this.voteSuccess(userId), this.voteError(userId));
    }

    voteSuccess = (userId: string) => (data: any) => {
        // Add success callback
        this.errorMessage = '';
        this._iot.publishUserUpdatedEvent(userId);
    }

    voteError = (userId: string) => (err: any) => {
        this.errorMessage = err.text();
        this.openErrorPopup();
    }

    openErrorPopup() {
        document.getElementById("errorDetected").click();
    }
}
