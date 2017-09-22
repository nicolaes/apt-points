import {Injectable} from '@angular/core';
import {CognitoUtil} from './cognito.service';
import * as AWS from 'aws-sdk/global';
import awsUtil from 'aws-sdk/lib/util.js';
import * as v4 from '../ext/aws-signature-v4.js';
import crypto from 'crypto-browserify';
// import MqttClient from 'mqtt/lib/client.js';
// import websocket from 'websocket-stream';
import 'paho-mqtt';
import {environment} from "../../environments/environment";

declare var Paho: any;

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

        const region = environment.bucketRegion;
        // const credentials = AWS.config.credentials;
        const credentials = {
            accessKeyId: '',
            secretAccessKey: '',
            sessionToken: ''
        };
        const host = 'a2v2xuqqwcwo3h.iot.eu-central-1.amazonaws.com';

        var datetime = awsUtil.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
        var date = datetime.substr(0, 8);

        var method = 'GET';
        var protocol = 'wss';
        var uri = '/mqtt';
        var service = 'iotdevicegateway';
        var algorithm = 'AWS4-HMAC-SHA256';

        var credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
        var canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
        canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
        canonicalQuerystring += '&X-Amz-Date=' + datetime;
        canonicalQuerystring += '&X-Amz-SignedHeaders=host';

        var canonicalHeaders = 'host:' + host + '\n';
        var payloadHash = awsUtil.crypto.sha256('', 'hex')
        var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

        var stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + awsUtil.crypto.sha256(canonicalRequest, 'hex');
        var signingKey = getSignatureKey(credentials.secretAccessKey, date, region, service);
        var signature = awsUtil.crypto.hmac(signingKey, stringToSign, 'hex');

        canonicalQuerystring += '&X-Amz-Signature=' + signature;
        // canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(credentials.sessionToken);
        var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;

        console.log();
        var client = new Paho.MQTT.Client(requestUrl, 'myuniqueid');
        var connectOptions = {
            onSuccess: function(){
                console.log('great success');
                // connect succeeded
            },
            useSSL: true,
            timeout: 3,
            mqttVersion: 4,
            onFailure: function() {
                console.log('failure');

                // connect failed
            }
        };
        client.connect(connectOptions);

        // new MqttClient(() => {
        //     return websocket(requestUrl, [ 'mqtt' ]);
        // });


        // let client = new MqttClient(() => {
        //     let url = v4.createPresignedURL(
        //         'GET',
        //         environment.iot_endpoint,
        //         '/mqtt',
        //         'iotdevicegateway',
        //         crypto.createHash('sha256').update('', 'utf8').digest('hex'),
        //         {
        //             'key': AWS.config.credentials.accessKeyId,
        //             'secret': AWS.config.credentials.secretAccessKey,
        //             'protocol': 'wss',
        //             'region': environment.bucketRegion
        //         }
        //     );
        //
        //     url += '&X-Amz-Security-Token=' + encodeURIComponent(AWS.config.credentials.sessionToken);
        //
        //     return websocket(url, [ 'mqtt' ]);
        // });

        // client.on('connect', () => {
        //     client.subscribe('test-topic');
        //     console.log('connected to iot mqtt websocket');
        // });
        // mqttClient.on('message', (topic, message) => {
        //     console.log(message.toString());
        // });
        //
        // return mqttClient;
    }

}

/**
 * utilities to do sigv4
 * @class SigV4Utils
 */
function getSignatureKey(key, date, region, service) {
    var kDate = awsUtil.crypto.hmac('AWS4' + key, date, 'buffer');
    var kRegion = awsUtil.crypto.hmac(kDate, region, 'buffer');
    var kService = awsUtil.crypto.hmac(kRegion, service, 'buffer');
    var kCredentials = awsUtil.crypto.hmac(kService, 'aws4_request', 'buffer');
    return kCredentials;
};

function getSignedUrl(host, region, credentials) {
    var datetime = awsUtil.date.iso8601(new Date()).replace(/[:\-]|\.\d{3}/g, '');
    var date = datetime.substr(0, 8);

    var method = 'GET';
    var protocol = 'wss';
    var uri = '/mqtt';
    var service = 'iotdevicegateway';
    var algorithm = 'AWS4-HMAC-SHA256';

    var credentialScope = date + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=' + algorithm;
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(credentials.accessKeyId + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + datetime;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = awsUtil.crypto.sha256('', 'hex')
    var canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

    var stringToSign = algorithm + '\n' + datetime + '\n' + credentialScope + '\n' + awsUtil.crypto.sha256(canonicalRequest, 'hex');
    var signingKey = getSignatureKey(credentials.secretAccessKey, date, region, service);
    var signature = awsUtil.crypto.hmac(signingKey, stringToSign, 'hex');

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    if (credentials.sessionToken) {
        canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(credentials.sessionToken);
    }

    var requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
    return requestUrl;
};