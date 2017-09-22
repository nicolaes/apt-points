import {Component} from "@angular/core";
import {UserLoginService} from "../../service/user-login.service";
import {LoggedInCallback} from "../../service/cognito.service";
import {Router} from "@angular/router";
import {DynamoDBService} from "../../service/ddb.service";
import {HttpTestService} from "../../service/http-test.service";


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
    public getData: string;
    public currentUserPoolId: string = this.userService.cognitoUtil.getCurrentUser()['pool'].userPoolId;
    public idToken: string = this.userService.cognitoUtil.getCognitoCreds().params["Logins"]
        ["cognito-idp.eu-central-1.amazonaws.com/" + this.currentUserPoolId];

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService,
                public _httpService: HttpTestService) {
        this.userService.isAuthenticated(this);
        console.log("in UseractivityComponent");
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

    addVoucher(userId) {
        this._httpService.addVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    removeVoucher(userId) {
        this._httpService.removeVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    startVote(userId) {
        this._httpService.startVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    startRmvVote(userId) {
        this._httpService.startRmvVote(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    addRmvVoucher(userId) {
        this._httpService.addRmvVoucher(this.idToken, userId)
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

}
