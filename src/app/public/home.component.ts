import {Component, OnInit} from "@angular/core";

declare let AWS: any;
declare let AWSCognito: any;

@Component({
    selector: 'aws-apt-points',
    template: '<p>Hello and welcome!"</p>'
})
export class AboutComponent {

}

@Component({
    selector: 'aws-apt-points',
    templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
    constructor() {
        console.log("HomeLandingComponent constructor");
    }
}

@Component({
    selector: 'aws-apt-points',
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {

    constructor() {
        console.log("HomeComponent constructor");
    }

    ngOnInit() {

    }
}


