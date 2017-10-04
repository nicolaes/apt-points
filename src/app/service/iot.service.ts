import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as v4 from '../ext/aws-signature-v4.js';
import crypto from 'crypto-browserify';
import * as mqtt from 'mqtt';
import websocket from 'websocket-stream';
import {environment} from '../../environments/environment';

@Injectable()
export class IotService {
    public client: mqtt.MqttClient;

    getAWS() {
        return AWS;
    }

    subscribeToPointUpdates(callback: Function): void {
        if (!this.client) {
            this.client = this.createMqttClient();
            this.client.on('connect', () => {
                this.client.subscribe('pointChange');
            });
        }

        this.client.on('message', (topic: string, messageStr: string) => {
            const message: {userId: string} = JSON.parse(messageStr);
            if (topic === 'pointChange' && message.userId != null) {
                callback(message.userId);
            }
        });
    }

    destroyWebSocket() {
        this.client.end();
        this.client = null;
    }

    publishUserUpdatedEvent(userId: string) {
        if (!this.client) {
            console.error('Can not publish - WebSocket not opened yet');
        }

        this.client.publish('pointChange', JSON.stringify({userId}));
    }

    private createMqttClient() {
        const AWS = this.getAWS();
        return new mqtt.MqttClient(() => {
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

            return websocket(url, ['mqtt']);
        }, {});
    }
}
