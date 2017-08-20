import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Stage, Layer, Circle, Line } from 'react-konva';
import styles from './style';

const NODE_SIZE = 10;

class AlgorithmPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nodes: props.network.nodes,
      edges: props.network.edges,
      selectedNode: null
    };
  }

  onNodeClick = e => this.setState({ selectedNode: e.target.attrs.id });

  onNodeDragStart = () => {
    // TODO
  };

  onNodeDragEnd = () => {
    // TODO
  };

  renderNode = (node, index) => (
    <Circle
      key={node.id}
      id={node.id}
      index={index}
      x={node.x}
      y={node.y}
      radius={NODE_SIZE}
      fill="red"
      shadowBlur={10}
      draggable="true"
      onClick={this.onNodeClick}
      onDragStart={this.onNodeDragStart}
      onDragEnd={this.onNodeDragEnd}
    />
  );

  renderEdge = edge => (
    <Line
      key={`${edge[0].id}-${edge[1].id}`}
      points={[edge[0].x, edge[0].y, edge[1].x, edge[1].y]}
      stroke="black"
    />
  );

  renderNetworkCanvas = () => {
    const { nodes, edges } = this.state;
    return (
      <Stage width="600" height="600" style={styles.canvas}>
        <Layer>
          { edges.map(this.renderEdge) }
          { nodes.map(this.renderNode) }
        </Layer>
      </Stage>
    );
  };

  render() {
    const { algorithm } = this.props;
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Set up your network and pick an algorithm</h2>
        <div style={styles.content}>
          <pre style={styles.code}>{algorithm}</pre>
          { this.renderNetworkCanvas() }
        </div>
      </div>
    );
  }
}

AlgorithmPage.propTypes = {
  algorithm: PropTypes.string.isRequired,
  network: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array
  }).isRequired
};

ReactDOM.render(
  <AlgorithmPage {...window.props} />,
  document.getElementById('root')
);
