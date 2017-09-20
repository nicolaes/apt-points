import {Component} from "@angular/core";
import {HttpTestService} from "../../service/http-test.service";

@Component({
    selector: 'http-test',
    template: `
        <button (click)="onTestGet()">Test GET Request</button>
        <p>Output: {{getData}}</p>
    `,
})
export class HTTPTestComponent {
    getData: string;

    constructor (private _httpService: HttpTestService) {}

    onTestGet() {
        this._httpService.addVoucher()
            .subscribe(
              data => this.getData = JSON.stringify(data),
                error => alert(error),
                () => console.log("Finished")
            );
    }
}

