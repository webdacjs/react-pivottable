import React from 'react';
import tips from './tips';
import PivotTable from '../src/PivotTable';
import '../src/pivottable.css';
import '../src/overrides.css';

class PivotTableUISmartWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {pivotState: props};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({pivotState: nextProps})
    }

    render() {
        return (<div>
                <h3>1. Pivot Table with MultiSum</h3>
                <PivotTable
                    key='multiSum'
                    data={tips}
                    rows={['Payer Gender', 'Day of Week']}
                    rowLabels={[null, 'Day of Week Replacement']}
                    cols={[]}
                    aggregatorName={'MultiSum'}
                    vals={['Tip', 'Total Bill']}
                    valsLegend={['Tip Replacement Label']}
                    rendererName={'Table'}
                    formatter={x => parseFloat(x).toFixed(1)}
                    showLegend={true}
                    showPopOver={true}
                />
                <h3>1. Pivot with Barchart (actual values / stacked) + popover</h3>
                <PivotTable
                    key='absoluteValuesStacked'
                    data={tips}
                    rows={['Payer Gender', 'Day of Week']}
                    rowLabels={[null, 'Day of Week Replacement']}
                    cols={[]}
                    aggregatorName={'MultiSum'}
                    vals={['Tip', 'Total Bill']}
                    valsLegend={['Tip Replacement Label']}
                    rendererName={'Table Barchart'}
                    formatter={x => parseFloat(x).toFixed(1)}
                    popOverFormatter={x => `$ ${parseFloat(x).toFixed(2)}`}
                    showLegend={true}
                    legendSteps={10}
                    stacked={true}
                    showBarValues={true}
                    showPopOver={true}
                    hideRowTotals={true}
                />
                <h3>Pivot with Barchart (percentage values / stacked with postproces and defining min and max vals)</h3>
                <PivotTable
                    key='percentageStackedMinMax'
                    data={tips}
                    rows={['Payer Gender', 'Day of Week']}
                    rowLabels={[null, 'Day of Week Replacement']}
                    cols={[]}
                    aggregatorName={'MultiSum'}
                    vals={['Tip', 'Total Bill']}
                    valsLegend={['Tip Replacement Label']}
                    rendererName={'Table Barchart'}
                    formatter={x => parseFloat(x).toFixed(1)}
                    popOverFormatter={x => `$ ${parseFloat(x).toFixed(2)}`}
                    showLegend={true}
                    minVal={0}
                    maxVal={100}
                    legendSteps={10}
                    postprocessfn={obj => {
                        const tipPerc = (obj['Tip'] / obj['Total Bill']) * 100
                        const totPerc = 100 - tipPerc
                        return {
                            Tip: tipPerc,
                            'Total Bill': totPerc
                    }}}
                    stacked={true}
                    showPopOver={true}
                    usePercentages={true}
                    hideRowTotals={true}
                />
                <h3>Pivot with Barchart (percentage values / stacked with postprocess show Bar values)</h3>
                <PivotTable
                    key='percentageWithBarValue'
                    data={tips}
                    rows={['Payer Gender', 'Day of Week']}
                    rowLabels={[null, 'Day of Week Replacement']}
                    cols={[]}
                    aggregatorName={'MultiSum'}
                    vals={['Tip', 'Total Bill']}
                    valsLegend={['Tip Replacement Label']}
                    rendererName={'Table Barchart'}
                    formatter={x => parseFloat(x).toFixed(1)}
                    popOverFormatter={x => `$ ${parseFloat(x).toFixed(2)}`}
                    showLegend={true}
                    legendSteps={10}
                    postprocessfn={obj => {
                        const tipPerc = (obj['Tip'] / obj['Total Bill']) * 100
                        const totPerc = 100 - tipPerc
                        return {
                            Tip: tipPerc,
                            'Total Bill': totPerc
                    }}}
                    stacked={true}
                    showBarValues={true}
                    showPopOver={true}
                    usePercentages={true}
                    hideRowTotals={true}
                />
                <h3>Pivot with Barchart (percentage values / stacked with postprocess show Bar values, overflowing)</h3>
                <PivotTable
                    key='percentageOverFLowing'
                    data={tips}
                    rows={['Payer Gender', 'Day of Week']}
                    rowLabels={[null, 'Day of Week Replacement']}
                    cols={[]}
                    aggregatorName={'MultiSum'}
                    vals={['Tip', 'Total Bill']}
                    valsLegend={['Tip Replacement Label']}
                    rendererName={'Table Barchart'}
                    formatter={x => parseFloat(x).toFixed(1)}
                    popOverFormatter={x => `$ ${parseFloat(x).toFixed(2)}`}
                    showLegend={true}
                    legendSteps={10}
                    postprocessfn={obj => {
                        // Artificially forcing a single value to be off.
                        if (obj.Tip === 83) {
                            return {
                                Tip: 40,
                                'Total Bill': 90
                            }
                        }
                        const tipPerc = (obj['Tip'] / obj['Total Bill']) * 100
                        const totPerc = 100 - tipPerc
                        return {
                            Tip: tipPerc,
                            'Total Bill': totPerc
                    }}}
                    stacked={true}
                    showBarValues={true}
                    showPopOver={true}
                    usePercentages={true}
                    // hideRowTotals={true}
                />
        </div>
        )
    }
}

export default class App extends React.Component {

    render() {
        return (
            <div>
                <div className="row">
                    <PivotTableUISmartWrapper />
                </div>
            </div>
        );
    }
}