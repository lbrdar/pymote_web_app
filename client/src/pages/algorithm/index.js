import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Algorithm from './Algorithm';
import { Network, constants } from '../../common/index';
import config from '../../config/index';
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
      showError: false,
      errorMsg: ''
    };

    // if returning from results page, display state that was active before running the simulation
    if (window.location.search && window.location.search.indexOf('loadOld=true') !== -1) {
      this.state = JSON.parse(localStorage.getItem('NetworkSetup'));
    }
  }

  setEdges = edges => this.setState({ edges });
  setNodes = nodes => this.setState({ nodes }, () => (this.state.settings.useCommRange && this.recalculateEdges()));
  setAlgorithm = algorithm => this.setState({ algorithm });
  setSettings = (settings) => {
    if (!this.state.settings.useCommRange && settings.useCommRange) this.recalculateEdges();
    this.setState({ settings });
  };

  closeModal = () => this.setState({ showError: false });

  generateNetwork = (networkType, numOfNodes, settings) => {
    let params = `networkType=${networkType}&&numOfNodes=${numOfNodes}`;
    if (settings) {
      params = `${params}&&settings=${JSON.stringify(settings)}`;
    }

    fetch(`${config.apiURL}/create_network/?${params}`)
      .then(body => body.json())
      .then(res => this.setState({ edges: res.edges, nodes: res.nodes }));
  };

  runSimulation = () => {
    const { algorithm, nodes } = this.state;
    if (!nodes.length || algorithm === null) {
      this.setState({
        showError: true,
        errorMsg: 'Before running simulation, you must add at least one node to the network and select at least one algorithm.'
      });
      return;
    }
    localStorage.setItem('NetworkSetup', JSON.stringify(this.state));
    this.form.submit();
  };

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
    const actions = [
      <FlatButton
        label="OK"
        primary={true}
        onClick={this.closeModal}
      />
    ];

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
              generateNetwork={this.generateNetwork}
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
          <Dialog
            title="Can't run simulation"
            actions={actions}
            modal={false}
            autoScrollBodyContent
            open={this.state.showError}
            onRequestClose={this.closeModal}
          >
            { this.state.errorMsg }
          </Dialog>
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
