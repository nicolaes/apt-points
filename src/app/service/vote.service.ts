import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {environment} from '../../environments/environment';
import {CognitoUtil} from './cognito.service';
import * as Rx from 'rxjs';


@Injectable()
export class VoteService {
    public mainApi: String = environment.lambda_endpoint + 'movePoint?' +
        'TableName=LoginTrailaptpoints';

    constructor(private _http: Http, private _cognitoUtil: CognitoUtil) {
    }

    movePoint(userId: string, direction: string, vouching: boolean) {
        return Rx.Observable
            .fromPromise(this._cognitoUtil.getIdTokenPromise())
            .mergeMap(idToken => {
                const headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Authorization',
                    'Authorization': idToken
                });
                const search = {
                    TableName: environment.ddbTableName,
                    userId,
                    direction,
                    vouching: vouching ? '1' : '0',
                };
                return this._http.get(environment.lambda_endpoint + 'movePoint', {headers, search})
                    .map(res => res.json());
            });
    }

    addVoucher(userId: string) {
        return this.movePoint(userId, 'up', true);
    }

    startVote(idToken, userId) {
        return this.movePoint(userId, 'up', false);
    }

    removeVoucher(idToken, userId) {
        return this.movePoint(userId, 'down', true);
    }

    startRmvVote(idToken, userId) {
        return this.movePoint(userId, 'down', false);
    }
}
