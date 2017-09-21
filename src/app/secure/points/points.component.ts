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

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService, public _httpService: HttpTestService) {
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

    addVoucher() {
        this._httpService.addVoucher()
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    removeVoucher() {
        this._httpService.removeVoucher()
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

    startVote() {
        this._httpService.startVote()
            .subscribe(
                data => this.getData = JSON.stringify(data),
                error => this.getData = error._body,
                () => console.log("Finished")
            );
    }

}
