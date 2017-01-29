import React, { Component } from 'react';
var _ = require('lodash');
import {isNumber} from './helpers.js';
import Panel from 'react-bootstrap/lib/Panel';
import {diagnoses, prescriptions} from './data.js';

class BaseLiftInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) { 
        this.setState({value: event.target.value}); 
        this.props.onChange({name: this.props.shortname, value: event.target.value});
    }

    render() {
        return(
            <span>
                <strong>{this.props.name}</strong>
                <input type="number" className="form-control" value={this.state.value} onChange={this.handleChange}/>
            </span>
        );
    }
}

class AccessoryLiftInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) { 
        this.setState({value: event.target.value}); 
        this.props.onChange({name: this.props.name, value: event.target.value});
    }

    render() {
        return (
            <span>
                <div className="col-md-5">
                    <strong>{this.props.name}</strong>
                </div>
                <div className="col-md-3">
                    <input type="number" className="form-control" value={this.state.value} onChange={this.handleChange}/>
                </div>
            </span>

        );
    }
}

function percentColor(percent, alpha=1, start = 0, end = 120) {
    let a = percent / 100;
    let b = end * a;
    let c = b + start;

    return 'hsla('+c+',70%,40%,' + alpha + ')';
}
    

class AccessoryRatioDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        // let actualRatioLabel = <span></span>;
        // let expectedRatioLabel = <span></span>;
        // if(isNumber(this.props.actualRatio)) {
        //     let delta = Math.abs(this.props.actualRatio - this.props.expectedRatio);
        //     let dangerZone = 15;
        //     let percent = 100 - Math.min(Math.abs(delta / dangerZone * 100), 100);
        //     let color = percentColor(percent);

        //     actualRatioLabel = <span className="label label-default" style={{'backgroundColor': color}}>{this.props.actualRatio.toFixed(0)}%</span>;
        //     expectedRatioLabel = <span className="label label-default">{this.props.expectedRatio.toFixed(0)}%</span>;
        // }
        //

         if(!isNumber(this.props.actualRatio)) {
             return null;
         }
        
        let x = Math.max(0, Math.min(100, (50 + this.props.actualRatio - this.props.expectedRatio))) + "%"

        let delta = Math.abs(this.props.actualRatio - this.props.expectedRatio);
        let dangerZone = 15;
        let percent = 100 - Math.min(Math.abs(delta / dangerZone * 100), 100);
        let color = percentColor(percent, 0.75);


                    //<rect x={5} y="25%" width="100%" height={3} color="blue"/>
         //<line x1={x} x2={x} y1="0%" y2="100%" strokeWidth="6" stroke="black"/>
        return (
            <div className="col-md-4">
                <svg width="100%" height={40}>
                    <line x1="0%" x2="100%" y1="50%" y2="50%" strokeWidth="1" stroke="rgba(0,0,0,0.5)"/>

                    <line x1="50%" x2="50%" y1="40%" y2="60%" strokeWidth="1" stroke="rgba(0,0,0,0.5)"/>

                    <circle cx={x} cy="50%" r={5} fill={color}/>

                </svg>
            </div>
        );

        // return (
        //     <span>
        //         <div className="col-md-2">
        //             <center>
        //                 {actualRatioLabel}
        //             </center>
        //         </div>
        //         <div className="col-md-2">
        //             <center>
        //                 {expectedRatioLabel}
        //             </center>
        //         </div>
        //     </span>
        // );
    }
}

class BaseResults extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if(this.props.show === false) {
            return null;
        }

        let resultContent = "default string " + this.props.results.snatch + " " + this.props.results.cnj;
        if(!isNumber(this.props.results.snatch) || !isNumber(this.props.results.cnj)) {
            let missing = null;
            if(!isNumber(this.props.results.snatch) && !isNumber(this.props.results.cnj))
                missing = (<span><strong>Snatch</strong> or <strong>Clean & Jerk</strong></span>);
            else if(!isNumber(this.props.results.snatch) && isNumber(this.props.results.cnj))
                missing = (<strong>Snatch</strong>);
            else if(isNumber(this.props.results.snatch) && !isNumber(this.props.results.cnj))
                missing = (<strong>Clean & Jerk</strong>);
            resultContent = <span>You didn't enter a {missing} number so we can't perform this analysis</span>;
        }
        else {

            let snatchCJIdealRatio = 80;
            let snatchCJRatioTolerance = 2;
            let snatchCJRatio = this.props.results.snatch / this.props.results.cnj * 100;

            let snatch = <strong>Snatch</strong>;
            let cnj = <strong>Clean & Jerk</strong>;
            let fs = <strong>Front Squat</strong>;

            // TODO: What should this message and tolerance be?
            if(Math.abs(snatchCJRatio - snatchCJIdealRatio) < snatchCJRatioTolerance) {
                resultContent = (
                    <span>
                        The ratio of your <strong>snatch</strong> to <strong>clean & jerk</strong> is within tolerance. Keep up the good work!
                    </span>
                );
            }
            else if(snatchCJRatio < snatchCJIdealRatio) {
                resultContent = (
                    <span>
                      Your <strong>snatch</strong> technique is inefficient,
                      you may benefit most from improving the efficiency of your <strong>snatch</strong>.
                    </span>
                );
            }
            else {
                if(this.props.accessories.cnj['Front Squat'] !== undefined) {

                    let fsqRatio = this.props.accessories.cnj['Front Squat'].value / this.props.results.cnj * 100;
                    let idealFsqRatio = this.props.accessories.cnj['Front Squat'].ratio;

                    if(fsqRatio > idealFsqRatio) {
                        resultContent = (
                            <span>
                                Your <strong>clean</strong> technique is
                                inefficient, you may benefit most from
                                improving the efficiency of your <strong>clean</strong>.
                            </span>);
                    } else {
                        resultContent = (
                            <span>
                                You are likely suffering from a strength problem,
                                you may benefit most from improving your strength
                                in the <strong>Front Squat</strong> and other
                                clean-related exercises.
                            </span>
                        ); }
                }
                else {
                    resultContent = (
                        <span>
                            Your {snatch} and {cnj} maxes are too close together.
                            Please enter a {fs} number so that we can further diagnose.
                        </span>
                    );
                }
            }

        }

        return (
            <span>
                <h3>4. Check out your results:</h3>
                <Panel header="Snatch Compared to C&J" bsStyle="danger">
                    {resultContent}
                </Panel>
            </span>
        );
    }
}

class AccessoryResults extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        if(!isNumber(this.props.base)) {
            return null;
        }

        let results = _.map(this.props.accessories, (accessory, accessoryName) => {
            let actualRatio = accessory.value / this.props.base * 100;
            return {
                name: accessoryName,
                actualRatio: actualRatio,
                expectedRatio: accessory.ratio,
                ratioDiff: actualRatio - accessory.ratio
            };
        });

        let analysisName = this.props.baseName + " Analysis";

        let resultsContent = null;
        if(results.length === 0) {
            resultsContent = (<span>Please enter one or more accessory maxes for analysis</span>);
        }
        else {
            let worst = _.maxBy(results, (r) => Math.abs(r.ratioDiff));
            let whichWay = worst.ratioDiff < 0 ? 'too_low' : 'too_high';

            let secondWorst = _.maxBy(results, (r) => {
                if(r.name === worst.name) { return 0; }
                return Math.abs(r.ratioDiff);
            });
            let whichWay2 = secondWorst.ratioDiff < 0 ? 'too_low' : 'too_high';

            let diagnosis = diagnoses[worst.name][whichWay];
            let prescription = prescriptions[worst.name][whichWay];

            // ######################################################################
            // Hacky exception code goes here...
            // TODO: Clean this up
            // ######################################################################

            // Grab the front squat entry from the list of results
            let frontSquat = _.find(results, (r) => { return r.name === 'Front Squat'; });

            // The "acceptable" range for the front squat
            let frontSquatAcceptableRange = 10.0;

            //////////////////////////////////////////////////////////////////////
            if(worst.name === 'Clean' && frontSquat !== undefined) {
                // Clean too high (and front squat ratio is within range) 
                if(worst.ratioDiff > 0 && Math.abs(frontSquat.ratioDiff) < frontSquatAcceptableRange) {
                    diagnosis = "Your biggest deficiency seems to rest with your jerk. " +
                        "Since your front squat to c&j ratio is within the right range, you very likely have jerk technique issues.";
                    prescription = "We recommend you analyze (or get coaching help to analyze) your jerk technique and work on fixing it.";
                }

                // Clean too high (and front squat ratio is lower than ideal)
                else if(worst.ratioDiff > 0 && frontSquat.ratioDiff < 0) {
                    diagnosis = "Your biggest deficiency seems to rest with your jerk. " + 
                        "Since your front squat to c&j is lower than expected, your Jerk issues may be strength related";
                    prescription = "We recommend you concentrate on getting your legs stronger.";
                }
            }
            //////////////////////////////////////////////////////////////////////
            else if(worst.name === 'Jerk' && frontSquat !== undefined) {
                // Jerk lower than expected (and front squat ratio is within range)
                if(worst.ratioDiff < 0 && Math.abs(frontSquat.ratioDiff) < frontSquatAcceptableRange) {
                    diagnosis = "Since your squat ratios appear to be within the right range, you may have jerk technique issues.";
                    prescription = "We recommend you analyze (or get coaching help to analyze) your jerk technique and work on fixing it.";
                }

                // Jerk lower than expected (and front squat ratio is lower than ideal)
                else if(worst.ratioDiff < 0 && frontSquat.ratioDiff < 0) {
                    diagnosis = "Since your squat ratios are below ideal range, your issues are likely strength-related";
                    prescription = "We recommend you concentrate on getting your legs stronger.";
                }
            }
            //////////////////////////////////////////////////////////////////////
            else if(worst.name === 'Seated Press') {
                // Press higher than ideal
                if(worst.ratioDiff > 0) {
                    diagnosis = diagnoses[secondWorst.name][whichWay2];
                    prescription = prescriptions[secondWorst.name][whichWay2];
                    worst = secondWorst;
                }
            }
            //////////////////////////////////////////////////////////////////////
            else if(worst.name === 'Power Clean') {
                // PCL lower than expected
                if(worst.ratioDiff < 0) {
                    diagnosis = "This tells us you may suffer from poor explosion/transition speed.";
                    prescription = "You should work on improving your explosion and your change of direction speed (getting under bar faster)";
                }

                // PCL higher than expected (and front squat ratio is within range)
                else if(frontSquat !== undefined && Math.abs(frontSquat.ratioDiff) < frontSquatAcceptableRange) {
                    diagnosis = "Since your front squat is within acceptable range, you likely have technical inefficiencies in your clean & jerk.";
                    prescription = "We recommend you analyze (or get coaching help to analyze) your clean & jerk technique and work on fixing it.";
                }

                // PCL higher than expected (and front squat ratio is lower than ideal)
                else if(frontSquat !== undefined && frontSquat.ratioDiff < 0) {
                    diagnosis = "Since your front squat is lower than the acceptable range, you may be lacking strength, mobility, or both.";
                    prescription = "We recommend you spend some time getting your legs stronger and/or improving your mobility";
                }
            }
            //////////////////////////////////////////////////////////////////////
            else if(worst.name === 'Overhead Squat') {
                // OHS higher than ideal
                if(worst.ratioDiff > 0) {
                    diagnosis = diagnoses[secondWorst.name][whichWay2];
                    prescription = prescriptions[secondWorst.name][whichWay2];
                    worst = secondWorst;
                }
            }
            //////////////////////////////////////////////////////////////////////
            else if(worst.name === 'Power Snatch') {
                // Lower than ideal
                if(worst.ratioDiff < 0) {
                    diagnosis = "This tells us you may suffer from poor explosion/transition speed.";
                    prescription = "You should work on improving your explosion and your change of direction speed (getting under bar faster)";
                }
            }

            // Create the generic description text for this calculation
            let description = `The ideal is to have your ${worst.name} at ${worst.expectedRatio.toFixed(2)}% 
                of your ${this.props.baseName}, however your ${worst.name} is at ${worst.actualRatio.toFixed(2)}%
                of your ${this.props.baseName}. That's a ${worst.ratioDiff.toFixed(2)}% differential.`

            // Create the HTML to display the diagnosis/prescription/description
            resultsContent = (
                    <span>
                        <p>
                            Based on your inputs the ratio with the greatest difference is <u>{worst.name}</u>. 
                        </p>
                        <dl>
                            <dt>Diagnosis</dt>
                            <dd>{diagnosis}</dd>

                            <dt>Prescription</dt>
                            <dd>{prescription}</dd>

                            <dt>How did we get this?</dt>
                            <dd>{description}</dd>
                        </dl>
                    </span>);
        }

        return (<Panel header={analysisName} bsStyle="danger">{resultsContent}</Panel>);
    }
}

export {BaseResults, AccessoryResults, BaseLiftInput, AccessoryLiftInput, AccessoryRatioDisplay};
