import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import styles from './style';

const NODE_SIZE = 10;

class AlgorithmPage extends React.Component {

  componentDidMount() {
    this.renderNetwork();
  }

  renderNetwork = () => {
    const { nodes, edges } = this.props.network;
    const ctx = this.canvas.getContext('2d');

    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_SIZE, 0, 2 * Math.PI);
      ctx.stroke();
    });

    edges.forEach((edge) => {
      const n1 = edge[0];
      const n2 = edge[1];

      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    });
  };

  render() {
    const { algorithm } = this.props;

    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Set up your network and pick an algorithm</h2>
        <div style={styles.content}>
          <pre style={styles.code}>{algorithm}</pre>
          <canvas
            ref={ref => (this.canvas = ref)}
            style={styles.canvas}
            width="600"
            height="600"
          />
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
