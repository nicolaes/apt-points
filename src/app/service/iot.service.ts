import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as v4 from '../ext/aws-signature-v4.js';
import crypto from 'crypto-browserify';
import * as mqtt from 'mqtt';
import websocket from 'websocket-stream';
import {environment} from '../../environments/environment';

@Injectable()
export class IotService {
    public client: mqtt.Client;

    getAWS() {
        return AWS;
    }

    subscribeToPoints(): void {
        // console.log("IotService: subscribing with creds - ", AWS.config.credentials);
        if (!this.client) {
            this.client = this.createMqttClient();
        }

        this.client.on('connect', () => {
            this.client.subscribe('pointChange');
            console.log('connected to iot mqtt websocket');
        });
        this.client.on('message', (topic, message) => {
            console.log(message.toString());
        });
    }

    private createMqttClient() {
        const AWS = this.getAWS();
        return new mqtt.Client(() => {
            let url = v4.createPresignedURL(
                'GET',
                environment.iot_endpoint,
                '/mqtt',
                'iotdevicegateway',
                crypto.createHash('sha256').update('', 'utf8').digest('hex'),
                {
                    'key': AWS.config.credentials.accessKeyId,
                    'secret': AWS.config.credentials.secretAccessKey,
                    'protocol': 'wss',
                    'region': environment.bucketRegion
                }
            );

            url += '&X-Amz-Security-Token=' + encodeURIComponent(AWS.config.credentials.sessionToken);

            return websocket(url, ['mqttv3.1']);
        }, {});
    }
}
