import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';



@Injectable()
export class HttpTestService {
    constructor (private _http: Http) {}

    addVoucher() {
        let headerss = new Headers({ 'Access-Control-Allow-Origin': '*',
                                     'Authorization': 'eyJraWQiOiJLQWtEcVJTUlpwa0U3MURzUVZOdm01TGZ1STQ2Z2J5VmpWV2t1R3' +
                                     'Q3ZnB3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhZGNlM2M2ZS01NjQ3LTQwYmMtYjIyYy1lNzdiN' +
                                     'zdhY2NkZGMiLCJhdWQiOiIxcW51ZHY3MDYyZmw4Zzh1YW5tamVxZTlydCIsImVtYWlsX3ZlcmlmaWVk' +
                                     'Ijp0cnVlLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTUwNTkyMDkwNSwiaXNzIjoiaHR0cHM' +
                                     '6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfNF' +
                                     'IwYTlJNW1sIiwibmlja25hbWUiOiJtaWhhaWJ1Y3VyIiwiY29nbml0bzp1c2VybmFtZSI6ImEubWloY' +
                                     'WkuYnVjdXJAZ21haWwuY29tIiwiZXhwIjoxNTA1OTI0NTA1LCJpYXQiOjE1MDU5MjA5MDUsImVtYWls' +
                                     'IjoiYS5taWhhaS5idWN1ckBnbWFpbC5jb20ifQ.BHFZxClIsUaVqF53biD0qountHsk2RU6bIDcWMyk' +
                                     '-O-cD0_dsEyng4FKhGJyQ1dPElEabcmSWZ4a7oWOKPT4xMTwF80EpAcIieCajafBLXm_VwaYPcObfLA' +
                                     'VnL-dH8xIrW-VBLni0cTu-0TYjSd8iapoZ6pJnHMXqpAeZocdffm8YbtMlYBBM7FnMh3WSjwJ_o2G4p' +
                                     '0RuaLtftmeAGq9ki-RzBrhTZFudhdRIsKKm9S7kPkeM__kmVqDNCvTxSNHKTd_Z0eiGBdBA9HVobAeG' +
                                     'cPH3oKpcW0MBChBBK2HAvBra3ePY33OLF8MK7mIqu1YiVoG6O1enIjVbB_41ng7vA'});
        return this._http.get(
            'https://8l6njnyhne.execute-api.eu-central-1.amazonaws.com/prod/movePoint?TableName=LoginTrailaptpoints' +
                '&userId=eu-central-1:713b00e0-a0d7-49b1-a024-07661741b6f9&direction=up&vouching=1',
            {headers: headerss})
            .map(res => res.json());
    }
}
