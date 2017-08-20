import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Algorithm from './Algorithm';
import Network from './Network';
import styles from './style';


function AlgorithmPage(props) {
  return (
    <MuiThemeProvider>
      <div>
        <AppBar
          title={<span style={styles.title}>Set up your network and pick an algorithm</span>}
          iconElementRight={<FlatButton label="Run simulation" />}
          showMenuIconButton={false}
        />
        <div style={styles.content}>
          <Algorithm algorithm={props.algorithm} algorithm2={props.algorithm2} />
          <Network network={props.network} />
        </div>
      </div>
    </MuiThemeProvider>
  );
}

AlgorithmPage.propTypes = {
  algorithm: PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  }).isRequired,
  algorithm2: PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  }).isRequired,
  network: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array
  }).isRequired
};

ReactDOM.render(
  <AlgorithmPage {...window.props} />,
  document.getElementById('root')
);
