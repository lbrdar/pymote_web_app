import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Network } from '../../common';
import { stringToColor } from '../../utils';
import styles from './style';

class ResultsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 0
    };
  }

  onStepChange = (e, step) => this.setState({ step });

  goBack = () => location.assign('/?loadOld=true');

  renderStatusColor = (status, statusColors) => (
    <div style={styles.color}>
      <div style={{ ...styles.colorValue, backgroundColor: statusColors[status] }} />
      <p style={styles.colorLabel}>{status || 'NO STATUS'}</p>
    </div>
  );

  render() {
    const { step } = this.state;
    const network = this.props.results[step];
    const statusColors = {};
    network.nodes.forEach((node) => {
      if (statusColors[node.status] === undefined) {
        statusColors[node.status] = stringToColor(node.status);
      }
    });

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>Simulation results</span>}
            iconElementRight={<FlatButton label="Go back" onClick={this.goBack} />}
            showMenuIconButton={false}
          />
          <div style={styles.content}>
            <div style={styles.align}>
              <div style={styles.colors}>
                <div>Node status colors legend: </div>
                {Object.keys(statusColors).map(status => this.renderStatusColor(status, statusColors))}
              </div>
              <Network
                settings={network.settings}
                edges={network.edges}
                nodes={network.nodes}
                configurable={false}
                statusColors={statusColors}
              />
            </div>
            <p style={styles.sliderLabel}>Displaying data for step number: {step}</p>
            <Slider
              min={0}
              max={this.props.results.length}
              step={1}
              value={step}
              onChange={this.onStepChange}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ResultsPage.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      nodes: PropTypes.array,
      edges: PropTypes.array,
      settings: PropTypes.object
    })
  ).isRequired
};

ReactDOM.render(
  <ResultsPage {...window.props} />,
  document.getElementById('root')
);
