import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Network } from '../../common';
import NodeInfo from './NodeInfo';
import { stringToColor } from '../../utils';
import styles from './style';

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      statusColors: this.getStatusColors(props.results[0]),
      selectedNode: null
    };
  }

  onStepChange = (e, step) => this.setState({
    step,
    statusColors: this.getStatusColors(this.props.results[step]),
    selectedNode: this.state.selectedNode
      ? this.props.results[step].nodes.find(node => node.id === this.state.selectedNode.id)
      : null
  });

  setSelectedNode = selectedNode => this.setState({ selectedNode });

  getStatusColors = (network) => {
    const statusColors = {};
    network.nodes.forEach((node) => {
      if (statusColors[node.status] === undefined) {
        statusColors[node.status] = stringToColor(node.status);
      }
    });
    return statusColors;
  };

  goBack = () => location.assign('/?loadOld=true');

  renderStatusColor = (status, statusColors) => (
    <div style={styles.color} key={status}>
      <div style={{ ...styles.colorValue, backgroundColor: statusColors[status] }} />
      <p style={styles.colorLabel}>{status || 'NO STATUS'}</p>
    </div>
  );

  renderSliderScale = (res, index) => {
    let textAlign = 'center';
    if (index === 0) textAlign = 'left';
    if (index === this.props.results.length - 1) textAlign = 'right';
    return (
      <div style={{ flex: 1, textAlign }} key={index}>
        {index}
      </div>
    );
  };

  render() {
    const { step, statusColors, selectedNode } = this.state;
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
            <div style={styles.align}>
              <div style={styles.colorsContainer}>
                <div>Node status colors legend: </div>
                {Object.keys(statusColors).map(status => this.renderStatusColor(status, statusColors))}
              </div>
              <Network
                settings={network.settings}
                edges={network.edges}
                nodes={network.nodes}
                setSelectedNode={this.setSelectedNode}
                configurable={false}
                statusColors={statusColors}
              />
              {!!selectedNode && <NodeInfo node={selectedNode} />}
            </div>
            <p style={styles.sliderLabel}>Displaying data for step: {step}</p>
            <Slider
              sliderStyle={styles.slider}
              min={0}
              max={this.props.results.length - 1}
              step={1}
              value={step}
              onChange={this.onStepChange}
            />
            <div style={styles.sliderScaleContainer}>
              {this.props.results.map(this.renderSliderScale)}
            </div>
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
