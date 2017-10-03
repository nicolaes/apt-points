import 'howler';
import {Injectable} from '@angular/core';
import {UserPoints} from '../secure/points/points.component';

const AUDIO_PATH = '/assets/sounds/';
const AUDIO_EXT = '.wav';
const SOUNDS = {
    votePlus: 'smb_bump',
    votePlusDone: 'smb_pipe',
    voteMinus: 'smb_coin',
    voteMinusDone: 'smb_1-up',
    voteMinusAll: 'smb_stage_clear'
};

export type SoundType = 'votePlus' | 'votePlusDone' | 'voteMinus' | 'voteMinusDone' | 'voteMinusAll';

@Injectable()
export class AudioService {
    playForUser(newUser: UserPoints, oldUser: UserPoints) {
        let soundType: SoundType;
        const pointUpdate = newUser.points - oldUser.points;
        const voteUpdate = newUser.underVote - oldUser.underVote;

        if (pointUpdate !== 0) {
            if (newUser.points === 0) {
                soundType = 'voteMinusAll';
            } else {
                soundType = (pointUpdate > 0) ? 'votePlusDone' : 'voteMinusDone';
            }
        } else {
            soundType = (voteUpdate > 0) ? 'votePlus' : 'voteMinus';
        }

        this.play(soundType);
    }

    play(soundType: SoundType) {
        if (SOUNDS[soundType]) {
            new Howl({src: AUDIO_PATH + SOUNDS[soundType] + AUDIO_EXT}).play();
        }
    }
}
