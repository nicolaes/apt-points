import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import 'rxjs/add/operator/map';


@Injectable()
export class HttpTestService {
    public mainApi: String = 'https://8l6njnyhne.execute-api.eu-central-1.amazonaws.com/prod/movePoint?' +
                             'TableName=LoginTrailaptpoints';

    constructor(private _http: Http) {
    }

    addVoucher(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
                               + '&direction=up'
                               + '&vouching=1';
        return this._http.get(
            url, {headers: headers}
        )
            .map(res => res.json());
    }

    startVote(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
                               + '&direction=up';
        return this._http.get(
            url, {headers: headers}
        )
            .map(res => res.json());
    }

    removeVoucher(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
                               + '&direction=down'
                               + '&vouching=1';
        return this._http.get(
            url, {headers: headers}
        )
            .map(res => res.json());
    }

    startRmvVote(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
            + '&direction=down';
        return this._http.get(
            url, {headers: headers}
        )
            .map(res => res.json());
    }

    addRmvVoucher(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
            + '&direction=down'
            + '&vouching=1';
        return this._http.get(
            url, {headers: headers}
        )
            .map(res => res.json());
    }
}
