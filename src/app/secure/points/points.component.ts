import {Component} from "@angular/core";
import {UserLoginService} from "../../service/user-login.service";
import {LoggedInCallback} from "../../service/cognito.service";
import {Router} from "@angular/router";
import {DynamoDBService} from "../../service/ddb.service";


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
    public msg: String = 'Vouch';

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService) {
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

}
