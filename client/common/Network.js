/* eslint-disable no-param-reassign */
import React, { PropTypes } from 'react';
import { Stage, Layer, Circle, Line, Rect } from 'react-konva';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import EdgeDetails from './EdgeDetails';
import NodeDetails from './NodeDetails';
import NetworkDetails from './NetworkDetails';

const NODE_SIZE = 10;
const NETWORK_WIDTH = 600;
const NETWORK_HEIGHT = 600;

const styles = {
  networkContainer: {
    margin: '0 auto'
  },
  canvas: {
    border: '1px solid black'
  }
};

class Network extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedNode: null,
      selectedEdge: null,
      showNodeDetails: false,
      showEdgeDetails: false,
      showSettings: false
    };
  }

  onSettingsClick = () => this.setState({ showSettings: true });

  onStageClick = ({ evt }) => {
    this.setState({ selectedNode: null });

    if (this.props.configurable) this.createNode(evt.offsetX, evt.offsetY);
  };

  onEdgeClick = ({ target }) => this.setState({ selectedEdge: this.props.edges[target.attrs.index] });
  onEdgeDoubleClick = () => this.openModal('Edge');

  onNodeClick = ({ target }) => {
    const { selectedNode } = this.state;
    const { edges, nodes, configurable } = this.props;
    const clickedNode = nodes.filter(node => (node.id === target.attrs.id))[0];
    if (selectedNode === null) {
      this.setState({ selectedNode: clickedNode });
    } else if (configurable && clickedNode.id !== selectedNode.id) {
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
    if (!this.props.configurable) return;

    const { offsetX: x, offsetY: y } = evt;
    const { attrs: { id: draggedNodeId } } = target;

    const edges = this.props.edges.map((edge) => {
      if (edge[0].id === draggedNodeId) {
        edge[0].x = x;
        edge[0].y = y;
      } else if (edge[1].id === draggedNodeId) {
        edge[1].x = x;
        edge[1].y = y;
      }

      return edge;
    });

    const nodes = this.props.nodes.map((node) => {
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

    this.setState({ selectedNode });
    this.props.setNodes(nodes);
    this.props.setEdges(edges);
  };

  openModal = type => this.setState({ [`show${type}Details`]: true });
  closeModal = () => this.setState({
    showSettings: false,
    showNodeDetails: false,
    showEdgeDetails: false,
    selectedNode: null,
    selectedEdge: null
  });

  createNode = (x, y) => {
    const { nodes, setNodes, settings } = this.props;
    nodes.push({
      id: Date.now(), // dummy temporary id
      x,
      y,
      theta: settings.defaultTheta,
      commRange: settings.defaultCommRange,
      memory: {}
    });

    setNodes(nodes);
  };
  updateNode = (oldNode, newNode) => {
    const { nodes, setNodes } = this.props;
    nodes.splice(nodes.indexOf(oldNode), 1, newNode);
    setNodes(nodes);
  };
  deleteNode = (node) => {
    const { edges, nodes, setEdges, setNodes } = this.props;
    nodes.splice(nodes.indexOf(node), 1);
    // remove all edges connected to that node
    const newEdges = edges.filter(edge => (edge[0].id !== node.id && edge[1].id !== node.id));
    setEdges(newEdges);
    setNodes(nodes);
    this.closeModal();
  };

  deleteEdge = (edge) => {
    const { edges, setEdges } = this.props;
    edges.splice(edges.indexOf(edge), 1);
    setEdges(edges);
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
    const { selectedNode, selectedEdge, showNodeDetails, showEdgeDetails, showSettings } = this.state;
    const { settings: { width, height }, edges, nodes, configurable } = this.props;

    return (
      <div style={{ ...styles.networkContainer, width: `${width + 2}px` }}>
        <RaisedButton primary label="Network settings" onClick={this.onSettingsClick} />
        <Paper zDepth={2}>
          <Stage width={width} height={height} style={styles.canvas}>
            <Layer>
              <Rect x={0} y={0} width={width} height={height} onClick={this.onStageClick} />
              { edges.map(this.renderEdge) }
              { nodes.map(this.renderNode) }
            </Layer>
          </Stage>
          {showNodeDetails &&
            <NodeDetails
              node={selectedNode}
              networkLimits={{ x: width, y: height }}
              configurable={configurable}
              closeModal={this.closeModal}
              updateNode={this.updateNode}
              deleteNode={this.deleteNode}
            />
          }
          {showEdgeDetails &&
            <EdgeDetails
              edge={selectedEdge}
              configurable={configurable}
              closeModal={this.closeModal}
              deleteEdge={this.deleteEdge}
            />
          }
          {showSettings &&
            <NetworkDetails
              settings={this.props.settings}
              configurable={configurable}
              closeModal={this.closeModal}
              updateNetwork={this.props.setSettings}
            />
          }
        </Paper>
      </div>
    );
  }
}

Network.propTypes = {
  settings: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    defaultCommRange: PropTypes.number,
    defaultTheta: PropTypes.number
  }).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  edges: PropTypes.arrayOf(PropTypes.array).isRequired,
  setNodes: PropTypes.func,
  setEdges: PropTypes.func,
  setSettings: PropTypes.func,
  configurable: PropTypes.bool
};

Network.defaultProps = {
  width: NETWORK_WIDTH,
  height: NETWORK_HEIGHT,
  setNodes: () => {},
  setEdges: () => {},
  setSettings: () => {},
  configurable: false
};

export default Network;
