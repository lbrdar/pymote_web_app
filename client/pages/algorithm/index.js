import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Algorithm from './Algorithm';
import { Network, constants } from '../../common';
import styles from './style';


class AlgorithmPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      algorithm: null,
      nodes: props.network.nodes,
      edges: props.network.edges,
      settings: {
        width: props.network.settings.width || constants.NETWORK_WIDTH,
        height: props.network.settings.height || constants.NETWORK_HEIGHT,
        defaultCommRange: props.network.settings.defaultCommRange || constants.COMM_RANGE,
        defaultTheta: props.network.settings.defaultTheta || constants.THETA,
        useCommRange: props.network.settings.useCommRange === 'true'
      },
    };
  }

  setEdges = edges => this.setState({ edges });
  setNodes = nodes => this.setState({ nodes }, () => (this.state.settings.useCommRange && this.recalculateEdges()));
  setAlgorithm = algorithm => this.setState({ algorithm });
  setSettings = (settings) => {
    if (!this.state.settings.useCommRange && settings.useCommRange) this.recalculateEdges();
    this.setState({ settings });
  };

  runSimulation = () => this.form.submit();

  recalculateEdges = () => {
    const { nodes } = this.state;
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 1; j < nodes.length; j++) {
        if (i !== j) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const d = Math.sqrt(((n1.x - n2.x) ** 2) + ((n1.y - n2.y) ** 2));
          if (d < n1.commRange && d < n2.commRange) {
            edges.push([
              {
                id: n1.id,
                x: n1.x,
                y: n1.y
              },
              {
                id: n2.id,
                x: n2.x,
                y: n2.y
              }
            ]);
          }
        }
      }
    }
    this.setState({ edges });
  };

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
              onSelect={this.setAlgorithm}
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
  }),
  csrfmiddlewaretoken: PropTypes.string
};

AlgorithmPage.defaultProps = {
  network: {
    nodes: [],
    edges: [],
    settings: {
      width: constants.NETWORK_WIDTH,
      height: constants.NETWORK_HEIGHT,
      defaultCommRange: constants.COMM_RANGE,
      defaultTheta: constants.THETA,
      useCommRange: constants.USE_COMM_RANGE
    }
  },
  csrfmiddlewaretoken: ''
};

ReactDOM.render(
  <AlgorithmPage {...window.props} />,
  document.getElementById('root')
);
