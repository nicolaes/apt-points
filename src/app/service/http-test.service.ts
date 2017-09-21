import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';



@Injectable()
export class HttpTestService {

    constructor (private _http: Http) {}

    addVoucher() {
        let headerss = new Headers({ 'Access-Control-Allow-Origin': '*',
            'Authorization': 'eyJraWQiOiJLQWtEcVJTUlpwa0U3MURzUVZOdm01TGZ1STQ2Z2J5VmpWV2t1R3Q3ZnB3PSIsImFsZyI6IlJTM' +
            'jU2In0.eyJzdWIiOiJlMzgzNjE2MS04NzNmLTQ2MTItOTM3ZC0xZDY1ZDM4ZGEzNmYiLCJhdWQiOiIxcW51ZHY3MDYyZmw4Zzh1YW5' +
            'tamVxZTlydCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTUwNTk4OTg1NiwiaXNzI' +
            'joiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfNFIwYTlJNW1sIiw' +
            'ibmlja25hbWUiOiJtaWhhaWIiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGIudG1mYUBnbWFpbC5jb20iLCJleHAiOjE1MDU5OTM0NTYsI' +
            'mlhdCI6MTUwNTk4OTg1NiwiZW1haWwiOiJkYi50bWZhQGdtYWlsLmNvbSJ9.X_WqoCQNmEY4GHlZQTk254vz7LCVOVF4hBhs8POu19' +
            '5Fc_18-3zOoFmeBE5lVN1a7zMkt4IMdc6hu2SysuSvsKV6NVLGvEZepzPJx6mOz9MXYGOnOt_xxy64PE8LUyJ0GFFIgtSfrFgVdy5v' +
            'L7Kw_4TmikTHjw5mmIbfH0z_xLhZckgLoXe2Bwh2XZNwjh1ojybbda2TSMCB_7Rodx-HLFiloAeSCdfhzssBXH4fQu4rwY5DmmFvbe' +
            'SmGm3W8fl097MNwRggIGdowoO9jYqOwePpdOA3SluBYeq55ghvo4VdJIBP-yq0wcMPnJGeS70b0gy8IiVZ53wu0FhL2O3EZw'});
        return this._http.get(
            'https://8l6njnyhne.execute-api.eu-central-1.amazonaws.com/prod/movePoint?TableName=LoginTrailaptpoints' +
                '&userId=eu-central-1:713b00e0-a0d7-49b1-a024-07661741b6f9&direction=up&vouching=1',
            {headers: headerss})
            .map(res => res.json());
    }

    startVote() {
        let headerss = new Headers({ 'Access-Control-Allow-Origin': '*',
            'Authorization': 'eyJraWQiOiJLQWtEcVJTUlpwa0U3MURzUVZOdm01TGZ1STQ2Z2J5VmpWV2t1R3Q3ZnB3PSIsImFsZyI6IlJTM' +
            'jU2In0.eyJzdWIiOiJlMzgzNjE2MS04NzNmLTQ2MTItOTM3ZC0xZDY1ZDM4ZGEzNmYiLCJhdWQiOiIxcW51ZHY3MDYyZmw4Zzh1YW5' +
            'tamVxZTlydCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTUwNTk4OTg1NiwiaXNzI' +
            'joiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfNFIwYTlJNW1sIiw' +
            'ibmlja25hbWUiOiJtaWhhaWIiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGIudG1mYUBnbWFpbC5jb20iLCJleHAiOjE1MDU5OTM0NTYsI' +
            'mlhdCI6MTUwNTk4OTg1NiwiZW1haWwiOiJkYi50bWZhQGdtYWlsLmNvbSJ9.X_WqoCQNmEY4GHlZQTk254vz7LCVOVF4hBhs8POu19' +
            '5Fc_18-3zOoFmeBE5lVN1a7zMkt4IMdc6hu2SysuSvsKV6NVLGvEZepzPJx6mOz9MXYGOnOt_xxy64PE8LUyJ0GFFIgtSfrFgVdy5v' +
            'L7Kw_4TmikTHjw5mmIbfH0z_xLhZckgLoXe2Bwh2XZNwjh1ojybbda2TSMCB_7Rodx-HLFiloAeSCdfhzssBXH4fQu4rwY5DmmFvbe' +
            'SmGm3W8fl097MNwRggIGdowoO9jYqOwePpdOA3SluBYeq55ghvo4VdJIBP-yq0wcMPnJGeS70b0gy8IiVZ53wu0FhL2O3EZw'});
        return this._http.get(
            'https://8l6njnyhne.execute-api.eu-central-1.amazonaws.com/prod/movePoint?TableName=LoginTrailaptpoints' +
            '&userId=eu-central-1:713b00e0-a0d7-49b1-a024-07661741b6f9&direction=up',
            {headers: headerss})
            .map(res => res.json());
    }

    removeVoucher() {
        let headerss = new Headers({ 'Access-Control-Allow-Origin': '*',
            'Authorization': 'eyJraWQiOiJLQWtEcVJTUlpwa0U3MURzUVZOdm01TGZ1STQ2Z2J5VmpWV2t1R3Q3ZnB3PSIsImFsZyI6IlJTM' +
            'jU2In0.eyJzdWIiOiJlMzgzNjE2MS04NzNmLTQ2MTItOTM3ZC0xZDY1ZDM4ZGEzNmYiLCJhdWQiOiIxcW51ZHY3MDYyZmw4Zzh1YW5' +
            'tamVxZTlydCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTUwNTk4OTg1NiwiaXNzI' +
            'joiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfNFIwYTlJNW1sIiw' +
            'ibmlja25hbWUiOiJtaWhhaWIiLCJjb2duaXRvOnVzZXJuYW1lIjoiZGIudG1mYUBnbWFpbC5jb20iLCJleHAiOjE1MDU5OTM0NTYsI' +
            'mlhdCI6MTUwNTk4OTg1NiwiZW1haWwiOiJkYi50bWZhQGdtYWlsLmNvbSJ9.X_WqoCQNmEY4GHlZQTk254vz7LCVOVF4hBhs8POu19' +
            '5Fc_18-3zOoFmeBE5lVN1a7zMkt4IMdc6hu2SysuSvsKV6NVLGvEZepzPJx6mOz9MXYGOnOt_xxy64PE8LUyJ0GFFIgtSfrFgVdy5v' +
            'L7Kw_4TmikTHjw5mmIbfH0z_xLhZckgLoXe2Bwh2XZNwjh1ojybbda2TSMCB_7Rodx-HLFiloAeSCdfhzssBXH4fQu4rwY5DmmFvbe' +
            'SmGm3W8fl097MNwRggIGdowoO9jYqOwePpdOA3SluBYeq55ghvo4VdJIBP-yq0wcMPnJGeS70b0gy8IiVZ53wu0FhL2O3EZw'});
        return this._http.get(
            'https://8l6njnyhne.execute-api.eu-central-1.amazonaws.com/prod/movePoint?TableName=LoginTrailaptpoints' +
            '&userId=eu-central-1:713b00e0-a0d7-49b1-a024-07661741b6f9&direction=down&vouching=1',
            {headers: headerss})
            .map(res => res.json());
    }
}
