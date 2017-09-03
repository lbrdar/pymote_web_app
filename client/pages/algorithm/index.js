import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Algorithm from './Algorithm';
import { Network } from '../../common';
import styles from './style';


class AlgorithmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      algorithm: null,
      nodes: props.network.nodes,
      edges: props.network.edges,
      settings: props.network.settings
    };
  }

  setSettings = settings => this.setState({ settings });
  setEdges = edges => this.setState({ edges });
  setNodes = nodes => this.setState({ nodes });
  selectAlgorithm = algorithm => this.setState({ algorithm });

  runSimulation = () => this.form.submit();

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title={<span style={styles.title}>Set up your network and pick an algorithm</span>}
            iconElementRight={<FlatButton label="Run simulation" onClick={this.runSimulation} />}
            showMenuIconButton={false}
          />
          <div style={styles.content}>
            <Network
              settings={this.state.settings}
              edges={this.state.edges}
              nodes={this.state.nodes}
              setSettings={this.setSettings}
              setEdges={this.setEdges}
              setNodes={this.setNodes}
              configurable={true}
            />
            <Algorithm
              algorithms={this.props.algorithms}
              selected={this.state.algorithm}
              onSelect={this.selectAlgorithm}
            />
          </div>
          <form ref={ref => (this.form = ref)} method="POST" action="/results/" style={styles.form}>
            <input type="hidden" name="csrfmiddlewaretoken" value={this.props.csrfmiddlewaretoken} />
            <input type="hidden" name="data" value={JSON.stringify(this.state)} />
          </form>
        </div>
      </MuiThemeProvider>
    );
  }
}

AlgorithmPage.propTypes = {
  algorithms: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  })).isRequired,
  network: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array,
    settings: PropTypes.object
  }).isRequired,
  csrfmiddlewaretoken: PropTypes.string
};

AlgorithmPage.defaultProps = {
  csrfmiddlewaretoken: ''
};

ReactDOM.render(
  <AlgorithmPage {...window.props} />,
  document.getElementById('root')
);
