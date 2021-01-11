import React from 'react';
import {PivotData} from './Utilities';

class RawExportRenderer extends React.PureComponent {
    render() {
      const pivotData = new PivotData(this.props);
  
      return (
        <textarea
          value={JSON.stringify(pivotData, null, 4)} // eslint-disable-line
          style={{width: window.innerWidth / 2, height: window.innerHeight / 2}}
          readOnly={true}
        />
      );
    }
  }
  
  RawExportRenderer.defaultProps = PivotData.defaultProps;
  RawExportRenderer.propTypes = PivotData.propTypes;

  export default RawExportRenderer