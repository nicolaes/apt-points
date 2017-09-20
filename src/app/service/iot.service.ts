import {Injectable} from '@angular/core';
import {CognitoUtil} from './cognito.service';
import * as AWS from 'aws-sdk/global';
import AWSMqtt from 'aws-mqtt-client';
import {environment} from "../../environments/environment";

@Injectable()
export class IotService {

    constructor(public cognitoUtil: CognitoUtil) {
        // console.log("IotService: constructor");
    }

    getAWS() {
        return AWS;
    }

    subscribeToPoints(): any {
        console.log("IotService: subscribing with creds - " + AWS.config.credentials);

        const mqttClient = new AWSMqtt({
            accessKeyId: AWS.config.credentials.accessKeyId,
            secretAccessKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken,
            endpointAddress: environment.iot_endpoint,
            region: environment.bucketRegion
        });

        mqttClient.on('connect', () => {
            mqttClient.subscribe('test-topic');
            console.log('connected to iot mqtt websocket');
        });
        mqttClient.on('message', (topic, message) => {
            console.log(message.toString());
        });

        return mqttClient;
    }
}
