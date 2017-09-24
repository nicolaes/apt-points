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

@Component({
    selector: 'aws-apt-points',
    templateUrl: './points.html',
})
export class PointsComponent implements LoggedInCallback {

    public userPointsList: Array<UserPoints> = [];
    public userPointsListSync: Array<UserPoints> = [];
    public buttonsList: Array<boolean> = [];
    public getData: string;
    // public currentUserPoolId: string = this.userService.cognitoUtil.getCurrentUser()['pool'].userPoolId;
    // public idToken: string = this.userService.cognitoUtil.getCognitoCreds().params['Logins']
    //     ['cognito-idp.eu-central-1.amazonaws.com/' + this.currentUserPoolId];
    public idToken: string;

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService,
                public voteService: VoteService, private _iot: IotService) {
        this.userService.isAuthenticated(this);

        this.loadButtons();
        // this.updateButtons();
    }

    loadButtons() {
        let startButton = true;
        let vouchAddButton = true;
        let vouchRmvButton = true;
        let rstAddButton = true;
        let rstRmvButton = true;
        this.buttonsList.push(startButton);
        this.buttonsList.push(vouchAddButton);
        this.buttonsList.push(rstAddButton);
        this.buttonsList.push(vouchRmvButton);
        this.buttonsList.push(rstRmvButton);
    }

    updateButtons() {
        let checkUnderVote = 0;
        for (let item of this.userPointsList) {
            console.log('in for');
            if (item.underVote !== 0) {
                checkUnderVote = item.underVote;
                console.log(checkUnderVote);
            }
        }
        if (checkUnderVote > 0) {
            this.buttonsList[0] = false;
            this.buttonsList[1] = true;
            this.buttonsList[2] = true;
            this.buttonsList[3] = false;
            this.buttonsList[4] = false;
        } else if (checkUnderVote < 0) {
            this.buttonsList[0] = false;
            this.buttonsList[1] = false;
            this.buttonsList[2] = false;
            this.buttonsList[3] = true;
            this.buttonsList[4] = true;
        } else {
            this.buttonsList[0] = true;
            this.buttonsList[1] = false;
            this.buttonsList[2] = false;
            this.buttonsList[3] = false;
            this.buttonsList[4] = false;
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        } else {
            console.log('scanning DDB');
            this.updateUserPointsList();
        }
    }

    movePoint() {
        // Make request
        '';
    }

    updateUserPointsList() {
        this.userPointsList.length = 0;
        this.ddb.getUserPoints(this.userPointsList).then(() => {
            // subscribe to websocket
            this._iot.subscribeToPoints((userId: string) => {
                console.log('userId changed', userId);
            });
        });
    }

    refreshData() {
        this.updateUserPointsList();
    }

    refreshButtons() {
        this.updateButtons();
    }


    refreshUserData(_userId) {
        // console.log('ref2');
        // this.ddb.getUserPoints(this.userPointsListSync);
        // console.log(this.userPointsList.find(myObj => myObj.userId === _userId));
        // this.userPointsList.filter(x => x === _userId)[0] = this.userPointsListSync.find(myObj => myObj.userId === _userId);
    }

    addVoucher(userId) {
        this.voteService.addVoucher(userId)
            .subscribe(data => {
                this.getData = JSON.stringify(data);
                this._iot.publishUserUpdatedEvent(userId);
            });
        this.updateButtons();
    }

    removeVoucher(userId) {
        this.voteService.removeVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log('Finished')
            );
        this.updateButtons();
    }

    startVote(userId) {
        this.voteService.startVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log('Finished')
            );
        this.updateButtons();
    }

    startRmvVote(userId) {
        this.voteService.startRmvVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log('Finished')
            );
        this.updateButtons();
    }

    addRmvVoucher(userId) {
        this.voteService.addRmvVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log('Finished')
            );
        this.updateButtons();
    }
}
