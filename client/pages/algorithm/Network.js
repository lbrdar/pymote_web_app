import React, { PropTypes } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import Paper from 'material-ui/Paper';
import styles from './style';

const NODE_SIZE = 10;

class Network extends React.Component {

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

  render() {
    const { nodes, edges } = this.state;
    return (
      <Paper zDepth={2} style={styles.networkContainer}>
        <Stage width="600" height="600" style={styles.canvas}>
          <Layer>
            { edges.map(this.renderEdge) }
            { nodes.map(this.renderNode) }
          </Layer>
        </Stage>
      </Paper>
    );
  }
}

Network.propTypes = {
  network: PropTypes.shape({
    nodes: PropTypes.array,
    edges: PropTypes.array
  }).isRequired
};

export default Network;
