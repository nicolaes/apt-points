import {Component, Input} from '@angular/core';
import {UserPoints} from './points.component';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'user',
    templateUrl: './user.html',
    animations: [
        trigger('userUpdate', [
            state('outdated', style({
                transform: 'translateY(0)'
            })),
            state('normal', style({
                transform: 'translateY(0)'
            })),
            transition('normal => outdated', animate('0')),
            transition('outdated => normal',
                animate('820ms', keyframes([
                    style({transform: 'translateY(-1px)', offset: 0.1}),
                    style({transform: 'translateY(2px)', offset: 0.2}),
                    style({transform: 'translateY(-4px)', offset: 0.3}),
                    style({transform: 'translateY(4px)', offset: 0.4}),
                    style({transform: 'translateY(-4px)', offset: 0.5}),
                    style({transform: 'translateY(4px)', offset: 0.6}),
                    style({transform: 'translateY(-4px)', offset: 0.7}),
                    style({transform: 'translateY(2px)', offset: 0.8}),
                    style({transform: 'translateY(-1px)', offset: 0.9})
                ])))
        ])
    ]
})
export class UserComponent {
    @Input() user: UserPoints;
    @Input() initiateVote: Function;
    SWIPE_ACTION = {LEFT: 'swipeleft', RIGHT: 'swiperight'};

    swipe(user: UserPoints, action = this.SWIPE_ACTION.RIGHT) {
        switch (action) {
            case this.SWIPE_ACTION.RIGHT:
                this.initiateVote(user, 'up');
                break;
            case this.SWIPE_ACTION.LEFT:
                this.initiateVote(user, 'down');
                break;
        }
    }

    panStart(user: UserPoints) {
        user.dragging = true;
    }

    panEnd(user) {
        user.dragging = false;
        user.panDelta = 0;
    }

    pan(user: UserPoints, event) {
        if (user.dragging === true) {
            user.panDelta = event.deltaX;
        }
    }

    getUserEntryStyle(user) {
        let left;
        let transition = 'left 300ms ease-in';
        switch (user.waitingForUpdate) {
            case 'up':
                left = '100%';
                break;
            case 'down':
                left = '-100%';
                break;
            default:
                left = user.panDelta + 'px';
                transition = '';
        }

        return {left, transition};
    }

    getUserAnimationState(user: UserPoints) {
        return (user.waitingForUpdate) ? 'outdated' : 'normal';
    }
}
