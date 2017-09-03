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
    };
  }

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
            <Algorithm
              algorithms={this.props.algorithms}
              selected={this.state.algorithm}
              onSelect={this.selectAlgorithm}
            />
            <Network
              edges={this.state.edges}
              nodes={this.state.nodes}
              setEdges={this.setEdges}
              setNodes={this.setNodes}
              configurable={true}
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
    edges: PropTypes.array
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
