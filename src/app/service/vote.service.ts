import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import * as AWS from 'aws-sdk/global';
import {environment} from '../../environments/environment';
import {CognitoUtil} from './cognito.service';
import * as Rx from 'rxjs';


@Injectable()
export class VoteService {
    public mainApi: String = environment.lambda_endpoint + 'movePoint?' +
        'TableName=LoginTrailaptpoints';

    constructor(private _http: Http, private _cognitoUtil: CognitoUtil) {
    }

    private getAWS() {
        return AWS;
    }

    private movePoint(userId: string, direction: string, vouching: boolean) {
        return Rx.Observable
            .fromPromise(this._cognitoUtil.getIdTokenPromise())
            .mergeMap(idToken => {
                const headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Authorization',
                    'Authorization': idToken
                });
                const search = {
                    TableName: 'LoginTrailaptpoints',
                    userId: userId,
                    direction: 'up',
                    vouching: '1',
                };
                return this._http.get(environment.lambda_endpoint + 'movePoint', {headers, search})
                    .map(res => res.json());
            });
    }

    addVoucher(userId: string) {
        return this.movePoint(userId, 'up', true);
    }

    startVote(idToken, userId) {
        let headers = new Headers({'Access-Control-Allow-Origin': '*', 'Authorization': idToken});
        let url = this.mainApi + '&userId=' + userId
            + '&direction=up';
        return this._http.get(url, {headers: headers})
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
