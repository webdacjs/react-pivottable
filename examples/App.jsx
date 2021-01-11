import React from 'react';
import tips from './budget';
import TableRenderers from '../src/TableRenderers';
import PivotTableUI from '../src/PivotTableUI';
import '../src/pivottable.css';
import '../src/overrides.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

class PivotTableUISmartWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {pivotState: props};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({pivotState: nextProps});
    }

    render() {
        return (
            <PivotTableUI
                renderers={Object.assign(
                    {},
                    TableRenderers,
                )}
                {...this.state.pivotState}
                onChange={s => this.setState({pivotState: s})}
                unusedOrientationCutoff={Infinity}
            />
        );
    }
}

export default class App extends React.Component {
    componentWillMount() {
        this.setState({
            mode: 'demo',
            filename: 'Tmp Budget',
            pivotState: {
                data: tips,
                rows: ['school', 'institute', 'unit', 'manager display name', 'category'],
                cols: [],
                aggregatorName: 'MultiSum',
                // vals: ['revised budget', 'expenses', 'commitments', 'available'],
                vals: ['expenses', 'available'],
                rendererName: 'Table Barchart',
                formatter: x => x === 0 || !x ? x : parseFloat(x).toFixed(0),
                hideRowTotals: true
            },
        });
    }

    onDrop(files) {
        this.setState(
            {
                mode: 'thinking',
                filename: '(Parsing CSV...)',
                textarea: '',
                pivotState: {data: []},
            },
            () =>
                Papa.parse(files[0], {
                    skipEmptyLines: true,
                    error: e => alert(e),
                    complete: parsed =>
                        this.setState({
                            mode: 'file',
                            filename: files[0].name,
                            pivotState: {data: parsed.data},
                        }),
                })
        );
    }

    onType(event) {
        Papa.parse(event.target.value, {
            skipEmptyLines: true,
            error: e => alert(e),
            complete: parsed =>
                this.setState({
                    mode: 'text',
                    filename: 'Data from <textarea>',
                    textarea: event.target.value,
                    pivotState: {data: parsed.data},
                }),
        });
    }

    render() {
        return (
            <div>
                <div className="row text-center">
                    <div className="col-md-3 col-md-offset-3">
                        <p>Try it right now on a file...</p>
                        <Dropzone
                            onDrop={this.onDrop.bind(this)}
                            accept="text/csv"
                            className="dropzone"
                            activeClassName="dropzoneActive"
                            rejectClassName="dropzoneReject"
                        >
                            <p>
                                Drop a CSV file here, or click to choose a file
                                from your computer.
                            </p>
                        </Dropzone>
                    </div>
                    <div className="col-md-3 text-center">
                        <p>...or paste some data:</p>
                        <textarea
                            value={this.state.textarea}
                            onChange={this.onType.bind(this)}
                            placeholder="Paste from a spreadsheet or CSV-like file"
                        />
                    </div>
                </div>
                <div className="row text-center">
                    <p>
                        <em>Note: the data never leaves your browser!</em>
                    </p>
                    <br />
                </div>
                <div className="row">
                    <h2 className="text-center">{this.state.filename}</h2>
                    <br />

                    <PivotTableUISmartWrapper {...this.state.pivotState} />
                </div>
            </div>
        );
    }
}
