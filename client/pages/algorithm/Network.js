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
      selectedNode: null,
      open: false
    };
  }

  onStageClick = (e) => {
    this.setState({ selectedNode: null });
    this.createNode(e.evt.offsetX, e.evt.offsetY);
  };

  onNodeClick = (e) => {
    const { edges, nodes, selectedNode } = this.state;
    const clickedNode = nodes.filter(node => (node.id === e.target.attrs.id))[0];
    if (selectedNode === null) {
      this.setState({ selectedNode: clickedNode });
    } else if (clickedNode.id !== selectedNode.id) {
      edges.push([
        {
          id: selectedNode.id,
          x: selectedNode.x,
          y: selectedNode.y
        },
        {
          id: clickedNode.id,
          x: clickedNode.x,
          y: clickedNode.y
        }
      ]);

      this.setState({ edges, selectedNode: null });
    }
  };

  onNodeDoubleClick = () => this.openModal();

  onNodeDragStart = () => {
    // TODO
  };

  onNodeDragEnd = () => {
    // TODO

  };

  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false, selectedNode: null });

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
      fill={(this.state.selectedNode && this.state.selectedNode.id === node.id) ? 'red' : 'green'}
      shadowBlur={10}
      draggable="true"
      onClick={this.onNodeClick}
      onDblclick={this.onNodeDoubleClick}
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
    const { nodes, edges, selectedNode, open } = this.state;

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
