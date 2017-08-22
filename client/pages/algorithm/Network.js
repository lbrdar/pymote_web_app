import React, { PropTypes } from 'react';
import { Stage, Layer, Circle, Line, Rect } from 'react-konva';
import Paper from 'material-ui/Paper';
import NodeDetails from './NodeDetails';
import styles from './style';

const NODE_SIZE = 10;
const NETWORK_WIDTH = 600;
const NETWORK_HEIGHT = 600;

class Network extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      nodes: props.network.nodes,
      edges: props.network.edges,
      selectedNodeId: null,
      open: false
    };
  }

  onStageClick = (e) => {
    this.createNode(e.evt.offsetX, e.evt.offsetY);
  };

  onNodeClick = (e) => {
    this.setState({ selectedNodeId: e.target.attrs.id });
    this.openModal();
  };

  onNodeDragStart = () => {
    // TODO
  };

  onNodeDragEnd = () => {
    // TODO

  };

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });

  createNode = (x, y) => {
    const nodes = this.state.nodes;
    nodes.push({
      id: Date.now(), // dummy temporary id
      x,
      y,
      theta: 0,
      memory: {}
    });

    this.setState({ nodes });
  };
  updateNode = (oldNode, newNode) => {
    const nodes = this.state.nodes;
    nodes.splice(nodes.indexOf(oldNode), 1, newNode);
    this.setState({ nodes });
  };

  renderNode = (node, index) => (
    <Circle
      key={node.id}
      id={node.id}
      index={index}
      x={node.x}
      y={node.y}
      radius={NODE_SIZE}
      fill={(node.id === this.state.selectedNodeId) ? 'red' : 'green'}
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
    const { nodes, edges, selectedNodeId, open } = this.state;
    const selectedNode = selectedNodeId && nodes.filter(node => node.id === selectedNodeId)[0];

    return (
      <Paper zDepth={2} style={styles.networkContainer}>
        <Stage width={NETWORK_WIDTH} height={NETWORK_HEIGHT} style={styles.canvas}>
          <Layer>
            <Rect x={0} y={0} width={NETWORK_WIDTH} height={NETWORK_HEIGHT} onClick={this.onStageClick} />
            { edges.map(this.renderEdge) }
            { nodes.map(this.renderNode) }
          </Layer>
        </Stage>
        {open &&
          <NodeDetails
            node={selectedNode}
            networkLimits={{ x: NETWORK_WIDTH, y: NETWORK_HEIGHT }}
            closeModal={this.closeModal}
            updateNode={this.updateNode}
          />
        }
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
