/* Waxman's Gym Ratio Calculator Copyright (C) 2017 Waxman's Gym

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/

import React from 'react';

let ranges = {
    ideal: 2.5,
    acceptable: 5,
    unacceptable: 7.5,
}

const accessories = {
    snatch: {
        'Overhead Squat':         { ratio: 105, display:  (<span>Overhead <br className="hidden-sm hidden-xs"/>Squat</span>) },
        'Power Snatch':           { ratio:  80, display:  (<span>Power <br className="hidden-sm hidden-xs"/>Snatch</span>) },
        'Snatch Blocks Abv Knee': { ratio:  95, display:  (<span>Snatch Blocks <br className="hidden-sm hidden-xs"/>Abv Knee</span>) },
        'Hang Snatch Below Knee': { ratio:  95, display:  (<span>Hang Snatch <br className="hidden-sm hidden-xs"/>Below Knee</span>) }
    },
    cnj: {
        'Clean':                  { ratio: 102, display: (<span>Clean</span>) },
        'Back Squat':             { ratio: 135, display: (<span>Back <br className="hidden-sm hidden-xs"/>Squat</span>) },
        'Front Squat':            { ratio: 115, display: (<span>Front <br className="hidden-sm hidden-xs"/>Squat</span>) },
        'Jerk':                   { ratio: 105, display: (<span>Jerk</span>) },
        'Power Clean':            { ratio:  80, display: (<span>Power <br className="hidden-sm hidden-xs"/>Clean</span>) },
        'Clean Blocks Abv Knee':  { ratio:  95, display: (<span>Clean Blocks <br className="hidden-sm hidden-xs"/>Abv Knee</span>) },
        'Hang Clean Below Knee':  { ratio:  95, display: (<span>Hang Clean <br className="hidden-sm hidden-xs"/>Below Knee</span>) }
    }
};

// Accessory Diagnoses
const diagnoses = {
    'Clean': {
        'too_low': 'This seems like a statistical impossibility. If you can clean & jerk it, you can clean it. Check your numbers and try again?',
        'too_high': 'You seem to have an issue with your jerk. If your squat ratios are in the right range, you may have jerk technique issues. If your squat ratios are below ideal range, you may have a strength and/or energy production problem.'
    },
    'Back Squat': {
        'too_low': 'You may be hampered by weak legs. If it doesnt already plaugue your lifts, you may be operating at a high level of stress.',
        'too_high': 'You appear to have adequate strength levels to clean & jerk more. You are likely being held back by your technique.'
    },
    'Front Squat': {
        'too_low': 'You may be hampered by weak legs. If it doesnt already plaugue your lifts, you may be operating at a high level of stress.',
        'too_high': 'You appear to have adequate strength levels to clean & jerk more. You are likely being held back by your technique.'
    },
    'Jerk': {
        'too_low': 'If your squat ratios are in the right range, you may have jerk technique issues. If your squat ratios are below ideal range, you may have a strength and/or energy production problem.',
        'too_high': 'Assuming your strength levels are adequate, this tells us you may have issues with your efficiency (technique and/or power production) in the clean.'
    },
    'Power Clean': {
        'too_low': 'This tells us you may suffer from either weak legs or poor explosion/transition speed.',
        'too_high': 'If your front squat is within acceptable range, you likely have technical inefficiencies in your clean & jerk. If your front squat is too low, you may be lacking strength, mobility, or both.'
    },
    'Clean Blocks Abv Knee': {
        'too_low': 'You likely have difficulty with vertical explosion. ',
        'too_high': 'You likely have issues when you break the bar off the floor.'
    },
    'Hang Clean Below Knee': {
        'too_low': 'You may have poor back strength or coordination problems.',
        'too_high': 'You likely have issues when you break the bar off the floor.'
    },
    'Overhead Squat': {
        'too_low': 'This tells us you have a problem with overhead stability.',
        'too_high': 'Even if you can overhead squat a large house, it doesnt tell us much.'
    },
    'Power Snatch': {
        'too_low': 'This tells us you may suffer from either weak legs or poor explosion/transition speed.',
        'too_high': 'This tells us you may be lacking sufficient mobility or coordination.'
    },
    'Snatch Blocks Abv Knee': {
        'too_low': 'You likely have difficulty with vertical explosion.',
        'too_high': 'You likely have issues when you break the bar off the floor.'
    },
    'Hang Snatch Below Knee': {
        'too_low': 'You may have poor back strength or coordination problems.',
        'too_high': 'You likely have issues when you break the bar off the floor.'
    }
};

// Accessory Prescriptions
const prescriptions = {
    'Clean': {
        'too_low': '',
        'too_high': 'Check to make sure your squat ratios are in the right range (enter them above for analysis). If not, you may get near-term benefit by getting stronger. If squats are in the right range, you should analyze your jerk technique and spend time trying to improve it.'
    },
    'Back Squat': {
        'too_low': 'We recommend you focus on getting your legs stronger.',
        'too_high': 'We recommend you focus on improving your efficiency and technique in the clean & jerk.'
    },
    'Front Squat': {
        'too_low': 'We recommend you focus on getting your legs stronger.',
        'too_high': 'We recommend you focus on improving your efficiency and technique in the clean & jerk.'
    },
    'Jerk': {
        'too_low': 'If your squat ratios are in the right range, we recommend you focus on improving your technique in the jerk. If your squats are below range, you need to get your legs stronger.',
        'too_high': 'Assuming your squat ratios are within adequate range, we recommend you focus on improving your efficiency and technique in the clean.'
    },
    'Power Clean': {
        'too_low': 'Train to improve your explosion/transition speed.',
        'too_high': 'If your front squat is within acceptable range, focus on improving your mobility in the clean & jerk. If your front squat is too low, spend some time getting your legs stronger.'
    },
    'Clean Blocks Abv Knee': {
        'too_low': 'You should spend more time improving your explosion',
        'too_high': 'You should spend more time practicing clean pulls from the floor and/or from a deficit.'
    },
    'Hang Clean Below Knee': {
        'too_low': 'You should get your back stronger, or find a coach to help you isolate and fix likely coordination problems.',
        'too_high': 'You should spend more time practicing clean pulls from the floor and/or from a deficit.'
    },
    'Overhead Squat': {
        'too_low': 'You should work on overhead strength and stability.',
        'too_high': 'Congratulations Mr./Mrs. Overhead Squat. We have no prescription for you.'
    },
    'Power Snatch': {
        'too_low': 'You should think about getting your legs stronger...or improving your explosion and speed changing directions/getting under the bar.',
        'too_high': 'You either need to improve your mobility or find a coach to help you isolate and fix likely coordination problems.'
    },
    'Snatch Blocks Abv Knee': {
        'too_low': 'You should spend more time improving your explosion.',
        'too_high': 'You should spend more time practicing clean pulls from the floor and/or from a deficit.'
    },
    'Hang Snatch Below Knee': {
        'too_low': 'You should get your back stronger, or find a coach to help you isolate and fix likely coordination problems.',
        'too_high': 'You should spend more time practicing clean pulls from the floor and/or from a deficit.'
    }
};
export {ranges, accessories, diagnoses, prescriptions};
