import {Injectable} from '@angular/core';
import {CognitoUserDetails, CognitoUtil} from './cognito.service';
import {environment} from '../../environments/environment';

import {Stuff} from '../secure/useractivity/useractivity.component';
import {UserPoints} from '../secure/points/points.component';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {GetItemInput} from 'aws-sdk/clients/dynamodb';
import {IotService} from './iot.service';
import {Headers, Http} from '@angular/http';
import * as Rx from 'rxjs';

@Injectable()
export class DynamoDBService {
    docClient: DynamoDB.DocumentClient;

    constructor(public cognitoUtil: CognitoUtil, public iot: IotService, private _http: Http) {
        // console.log("DynamoDBService: constructor");
    }

    getAWS() {
        return AWS;
    }

    getLogEntries(mapArray: Array<Stuff>) {
        console.log('DynamoDBService: reading from DDB with creds - ' + AWS.config.credentials);
        var params = {
            TableName: environment.ddbTableName,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': this.cognitoUtil.getCognitoIdentity()
            }
        };

        var clientParams: any = {};
        if (environment.dynamodb_endpoint) {
            clientParams.endpoint = environment.dynamodb_endpoint;
        }
        var docClient = new DynamoDB.DocumentClient(clientParams);
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error('DynamoDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                // print all the movies
                console.log('DynamoDBService: Query succeeded.');
                data.Items.forEach(function (logitem) {
                    mapArray.push({type: logitem.type, date: logitem.activityDate});
                });
            }
        }
    }

    getUserPoints(userPointsList: Array<UserPoints>, callback: Function) {
        var params = {
            TableName: environment.ddbTableName,
            FilterExpression : 'confirmed = :confirmed',
            ExpressionAttributeValues : {':confirmed' : true}
        };

        var clientParams: any = {};
        if (environment.dynamodb_endpoint) {
            clientParams.endpoint = environment.dynamodb_endpoint;
        }
        const docClient = new DynamoDB.DocumentClient(clientParams);
        return docClient.scan(params, (err, data) => {
            if (err) {
                console.error('DynamoDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach((userData: any) => {
                    userPointsList.push({
                        userId: userData.userId,
                        userName: userData.userName,
                        points: userData.points,
                        underVote: userData.underVote,
                        dragging: false,
                        panDelta: 0,
                        waitingForUpdate: null
                    });
                });

                callback();
            }
        });
    }

    updateUserPointsById(user: UserPoints): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!user) {
                throw new Error('User not found ' + user.userId);
            }

            var clientParams: any = {};
            if (environment.dynamodb_endpoint) {
                clientParams.endpoint = environment.dynamodb_endpoint;
            }

            const params: GetItemInput = {
                TableName: environment.ddbTableName,
                Key: {userId: user.userId}
            };

            const docClient = new DynamoDB.DocumentClient(clientParams);
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error('DynamoDBService: Unable to query the table. Error JSON:', JSON.stringify(err, null, 2));
                    reject();
                } else {
                    const oldUser = Object.assign({}, user);
                    user.points = data.Item.points;
                    user.underVote = data.Item.underVote;
                    resolve({newUser: user, oldUser});
                }
            });
        });
    }

    writeLogEntry(type: string) {
        try {
            let date = new Date().toString();
            console.log('DynamoDBService: Writing log entry. Type:' + type + ' ID: ' +
                this.cognitoUtil.getCognitoIdentity() + ' Date: ' + date);
            this.write(this.cognitoUtil.getCognitoIdentity(), date, type);
        } catch (exc) {
            console.log('DynamoDBService: Couldn\'t write to DDB');
        }

    }

    write(data: string, date: string, type: string): void {
        console.log('DynamoDBService: writing ' + type + ' entry');

        let clientParams: any = {
            params: {TableName: environment.ddbTableName}
        };
        if (environment.dynamodb_endpoint) {
            clientParams.endpoint = environment.dynamodb_endpoint;
        }
        var DDB = new DynamoDB(clientParams);

        // Write the item to the table
        var itemParams =
            {
                TableName: environment.ddbTableName,
                Item: {
                    userId: {S: data},
                    activityDate: {S: date},
                    type: {S: type}
                }
            };
        DDB.putItem(itemParams, function (result) {
            console.log('DynamoDBService: wrote entry: ' + JSON.stringify(result));
        });
    }

    createUser() {
        return Rx.Observable
            .fromPromise(this.cognitoUtil.getUserDetails())
            .mergeMap((userDetails: CognitoUserDetails) => {
                const {idToken, attributes, userId} = userDetails;
                const usernameAttr = attributes.find(attribute => attribute.getName() === 'nickname');
                const headers = new Headers({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Authorization',
                    'Authorization': idToken
                });
                const search = {
                    TableName: environment.ddbTableName,
                    userName: usernameAttr.getValue(),
                    userId: userId
                };
                return this._http.get(environment.lambda_endpoint + 'createUser', {headers, search})
                    .map(res => res.json());
            });
    }

}


