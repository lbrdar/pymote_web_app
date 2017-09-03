import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Network } from '../../common';
import styles from './style';

class ResultsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      step: 0
    };
  }

  onStepChange = (e, step) => this.setState({ step });

  goBack = () => {
    // TODO: go back to algorithm page
  };

  render() {
    const { step } = this.state;
    const network = this.props.results[step];
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>Simulation results</span>}
            iconElementRight={<FlatButton label="Go back" onClick={this.goBack} />}
            showMenuIconButton={false}
          />
          <div style={styles.content}>
            <Slider
              min={0}
              max={this.props.results.length}
              step={1}
              value={step}
              onChange={this.onStepChange}
            />
            <Network
              settings={network.settings}
              edges={network.edges}
              nodes={network.nodes}
              configurable={false}
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
