import React, {useState} from 'react';
import Popover from 'react-popover';

export default function PopOverComponent({
  showPopOver,
  popOverFormatter,
  rowkey,
  originalValues,
  valsAttrs,
  rowAttrs,
  children,
}) {
  const [hovered, setHovered] = useState();

  const formatPopOverValue = val =>
    popOverFormatter ? popOverFormatter(val) : val;

  const popOverKeys = [...rowAttrs, ...valsAttrs];
  const popOverValues = [
    ...rowkey,
    ...originalValues.map(x => formatPopOverValue(x)),
  ];

  const getPopOver = () => (
    <div className="popoverBox">
      <table className="popOverBox-table">
        <tbody>
          {popOverKeys.map((key, i) => (
            <tr key={`tr-${i}`}>
              <td className="popOverBox-table-cell" key={`tdk-${i}`}>
                {key}:
              </td>
              <td className="popOverBox-table-cell" key={`tdv-${i}`}>
                <b>{popOverValues[i]}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Popover
      isOpen={showPopOver ? hovered : false}
      place={'below'}
      tipSize={.01}
      enterExitTransitionDurationMs={false}
      body={getPopOver()}
    >
      <div onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered()}>
        {children}
      </div>
    </Popover>
  );
}
