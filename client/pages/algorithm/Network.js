/* eslint-disable no-param-reassign */
import React, { PropTypes } from 'react';
import { Stage, Layer, Circle, Line, Rect } from 'react-konva';
import Paper from 'material-ui/Paper';
import EdgeDetails from './EdgeDetails';
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
      selectedEdge: null,
      showNodeDetails: false,
      showEdgeDetails: false
    };
  }

  onStageClick = ({ evt }) => {
    this.setState({ selectedNode: null });
    this.createNode(evt.offsetX, evt.offsetY);
  };

  onEdgeClick = ({ target }) => this.setState({ selectedEdge: this.state.edges[target.attrs.index] });
  onEdgeDoubleClick = () => this.openModal('Edge');

  onNodeClick = ({ target }) => {
    const { edges, nodes, selectedNode } = this.state;
    const clickedNode = nodes.filter(node => (node.id === target.attrs.id))[0];
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
  onNodeDoubleClick = () => this.openModal('Node');
  onNodeDragMove = ({ evt, target }) => {
    const { offsetX: x, offsetY: y } = evt;
    const { attrs: { id: draggedNodeId } } = target;

    const edges = this.state.edges.map((edge) => {
      if (edge[0].id === draggedNodeId) {
        edge[0].x = x;
        edge[0].y = y;
      } else if (edge[1].id === draggedNodeId) {
        edge[1].x = x;
        edge[1].y = y;
      }

      return edge;
    });

    const nodes = this.state.nodes.map((node) => {
      if (node.id === draggedNodeId) {
        node.x = x;
        node.y = y;
      }
      return node;
    });

    const { selectedNode } = this.state;
    if (selectedNode && selectedNode.id === draggedNodeId) {
      selectedNode.x = x;
      selectedNode.y = y;
    }

    this.setState({ edges, nodes, selectedNode });
  };

  openModal = type => this.setState({ [`show${type}Details`]: true });
  closeModal = () => this.setState({ showNodeDetails: false, showEdgeDetails: false, selectedNode: null, selectedEdge: null });

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
  deleteNode = (node) => {
    const { edges, nodes } = this.state;
    nodes.splice(nodes.indexOf(node), 1);
    // remove all edges connected to that node
    const newEdges = edges.filter(edge => (edge[0].id !== node.id && edge[1].id !== node.id));
    this.setState({ edges: newEdges, nodes });
    this.closeModal();
  };

  deleteEdge = (edge) => {
    const edges = this.state.edges;
    edges.splice(edges.indexOf(edge), 1);
    this.setState({ edges });
    this.closeModal();
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
      onDragMove={this.onNodeDragMove}
    />
  );

  renderEdge = (edge, index) => {
    const { selectedEdge } = this.state;
    const isSelected = (selectedEdge && selectedEdge[0].id === edge[0].id && selectedEdge[1].id === edge[1].id);
    return (
      <Line
        key={`${edge[0].id}-${edge[1].id}`}
        index={index}
        points={[edge[0].x, edge[0].y, edge[1].x, edge[1].y]}
        stroke={isSelected ? 'red' : 'black'}
        onClick={this.onEdgeClick}
        onDblclick={this.onEdgeDoubleClick}
      />
    );
  };

  render() {
    const { nodes, edges, selectedNode, selectedEdge, showNodeDetails, showEdgeDetails } = this.state;

    return (
      <Paper zDepth={2} style={styles.networkContainer}>
        <Stage width={NETWORK_WIDTH} height={NETWORK_HEIGHT} style={styles.canvas}>
          <Layer>
            <Rect x={0} y={0} width={NETWORK_WIDTH} height={NETWORK_HEIGHT} onClick={this.onStageClick} />
            { edges.map(this.renderEdge) }
            { nodes.map(this.renderNode) }
          </Layer>
        </Stage>
        {showNodeDetails &&
          <NodeDetails
            node={selectedNode}
            networkLimits={{ x: NETWORK_WIDTH, y: NETWORK_HEIGHT }}
            closeModal={this.closeModal}
            updateNode={this.updateNode}
            deleteNode={this.deleteNode}
          />
        }
        {showEdgeDetails &&
          <EdgeDetails
            edge={selectedEdge}
            closeModal={this.closeModal}
            deleteEdge={this.deleteEdge}
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
