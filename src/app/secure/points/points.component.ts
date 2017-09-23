import {Component} from "@angular/core";
import {UserLoginService} from "../../service/user-login.service";
import {LoggedInCallback} from "../../service/cognito.service";
import {Router} from "@angular/router";
import {DynamoDBService} from "../../service/ddb.service";
import {HttpTestService} from "../../service/http-test.service";
import {CognitoUtil} from "../../service/cognito.service";


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
    public currentUserPoolId: string = this.userService.cognitoUtil.getCurrentUser()['pool'].userPoolId;
    public idToken: string = this.userService.cognitoUtil.getCognitoCreds().params["Logins"]
        ["cognito-idp.eu-central-1.amazonaws.com/" + this.currentUserPoolId];

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService,
                public _httpService: HttpTestService, public _cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        console.log("in UseractivityComponent");
        this.loadButtons();
     //   this.updateButtons();
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
        for (let item of this.userPointsList){
            console.log('in for');
            if (item.underVote !== 0) {
                checkUnderVote = item.underVote;
                console.log(checkUnderVote);
            }
        }
        if ( checkUnderVote > 0 ) {
            this.buttonsList[0] = false;
            this.buttonsList[1] = true;
            this.buttonsList[2] = true;
            this.buttonsList[3] = false;
            this.buttonsList[4] = false;
        } else if ( checkUnderVote < 0) {
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
            console.log("scanning DDB");
            this.ddb.getUserPoints(this.userPointsList);
        }
    }

    movePoint() {
        // Make request
        '';
    }
    updateUserPointsList() {
        this.userPointsList.length = 0;
        this.ddb.getUserPoints(this.userPointsList);

    }

    refreshData() {
        this.updateUserPointsList();
    }

    refreshButtons() {
        this.updateButtons();
    }


    refreshV2(_userId) {
        console.log("ref2");
        this.ddb.getUserPoints(this.userPointsListSync);
        console.log(this.userPointsList.find( myObj => myObj.userId === _userId));
        this.userPointsList.filter( x => x === _userId)[0] = this.userPointsListSync.find( myObj => myObj.userId === _userId);
    }

    addVoucher(userId) {
        this._httpService.addVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
        this.updateButtons();
    }

    removeVoucher(userId) {
        this._httpService.removeVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
        this.updateButtons();
    }

    startVote(userId) {
        this._httpService.startVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
        this.updateButtons();
    }

    startRmvVote(userId) {
        this._httpService.startRmvVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
        this.updateButtons();
    }

    addRmvVoucher(userId) {
        this._httpService.addRmvVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
        this.updateButtons();
    }
}
