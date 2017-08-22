import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import styles from './style';


class NodeDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      x: props.node.x,
      y: props.node.y,
      theta: props.node.theta,
      memory: JSON.stringify(props.node.memory, null, 2),
      error: ''
    };
  }

  isValid = () => {
    const { x, y, theta, memory } = this.state;
    const { networkLimits } = this.props;
    const parsedX = parseFloat(x);
    const parsedY = parseFloat(y);
    const parsedTheta = parseFloat(theta);
    let parsedMemory = null;
    try {
      parsedMemory = JSON.parse(memory);
    } catch (e) {
      this.setState({ error: 'Memory must be in a format of an object containing "key":"value" pairs.' });
      return false;
    }

    if (isNaN(parsedX) || parsedX < 0 || parsedX > networkLimits.x) {
      this.setState({ error: 'Invalid position x value.' });
      return false;
    }
    if (isNaN(parsedY) || parsedY < 0 || parsedY > networkLimits.x) {
      this.setState({ error: 'Invalid position y value.' });
      return false;
    }
    if (isNaN(parsedTheta) || parsedTheta < 0 || parsedTheta > 360) {
      this.setState({ error: 'Invalid theta value.' });
      return false;
    }
    if (parsedMemory !== Object(parsedMemory)) {
      this.setState({ error: 'Memory must be in a format of an object containing "key":"value" pairs.' });
      return false;
    }

    return true;
  };

  save = () => {
    const { x, y, theta, memory } = this.state;

    if (!this.isValid()) return;

    this.props.updateNode(
      this.props.node,
      {
        id: this.props.node.id,
        x: parseFloat(x),
        y: parseFloat(y),
        theta: parseFloat(theta),
        memory: JSON.parse(memory)
      }
    );
    this.props.closeModal();
  };

  render() {
    const { x, y, theta, memory, error } = this.state;
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeModal}
      />,
      <RaisedButton
        label="Save changes"
        primary={true}
        keyboardFocused={true}
        onClick={this.save}
      />
    ];

    return (
      <Dialog
        title="Node details"
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        { !!error && <div style={styles.errorMsg}>{error}</div> }
        <TextField
          disabled
          fullWidth
          floatingLabelText="Id"
          value={this.props.node.id}
        />
        <TextField
          fullWidth
          floatingLabelText="X position"
          value={x}
          onChange={(e, text) => this.setState({ x: text })}
        />
        <TextField
          fullWidth
          floatingLabelText="Y position"
          value={y}
          onChange={(e, text) => this.setState({ y: text })}
        />
        <TextField
          fullWidth
          floatingLabelText="Theta"
          value={theta}
          onChange={(e, text) => this.setState({ theta: text })}
        />
        <TextField
          fullWidth
          floatingLabelText="Memory"
          multiLine
          rows={5}
          value={memory}
          onChange={(e, text) => this.setState({ memory: text })}
        />
      </Dialog>
    );
  }
}

NodeDetails.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    theta: PropTypes.number,
    memory: PropTypes.object,
  }).isRequired,
  networkLimits: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
};

export default NodeDetails;
