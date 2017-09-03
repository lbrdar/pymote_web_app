import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const styles = {
  errorMsg: {
    flex: 1,
    color: 'red',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  }
};


class NetworkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.settings.width,
      height: props.settings.height,
      defaultCommRange: 600,
      defaultTheta: 0,
      error: ''
    };
  }

  isValid = () => {
    const { width, height, defaultCommRange, defaultTheta } = this.state;
    const parsedWidth = parseInt(width, 10);
    const parsedHeight = parseInt(height, 10);
    const parsedCommRange = parseFloat(defaultCommRange);
    const parsedTheta = parseFloat(defaultTheta);

    if (isNaN(parsedWidth) || parsedWidth <= 0) {
      this.setState({ error: 'Invalid width. Width must be a positive integer.' });
      return false;
    }
    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      this.setState({ error: 'Invalid height. Height must be a positive integer.' });
      return false;
    }
    if (isNaN(parsedCommRange) || parsedCommRange <= 0) {
      this.setState({ error: 'Invalid default communication range.' });
      return false;
    }
    if (isNaN(parsedTheta) || parsedTheta < 0 || parsedTheta > 360) {
      this.setState({ error: 'Invalid default theta value.' });
      return false;
    }

    return true;
  };

  save = () => {
    const { width, height, defaultCommRange, defaultTheta } = this.state;

    if (!this.isValid()) return;

    this.props.updateNetwork({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      defaultCommRange: parseFloat(defaultCommRange),
      defaultTheta: parseFloat(defaultTheta)
    });
    this.props.closeModal();
  };

  render() {
    const { width, height, defaultCommRange, defaultTheta, error } = this.state;
    const { configurable } = this.props;
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeModal}
      />
    ];

    if (configurable) {
      actions.push(
        <RaisedButton
          label="Save changes"
          primary={true}
          keyboardFocused={true}
          onClick={this.save}
        />
      );
    }

    return (
      <Dialog
        title="Network settings"
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open
        onRequestClose={this.props.closeModal}
      >
        { !!error && <div style={styles.errorMsg}>{error}</div> }
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Network width"
          value={width}
          onChange={(e, text) => this.setState({ width: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Network height"
          value={height}
          onChange={(e, text) => this.setState({ height: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Default communication range of new nodes"
          value={defaultCommRange}
          onChange={(e, text) => this.setState({ defaultCommRange: text })}
        />
        <TextField
          disabled={!configurable}
          fullWidth
          floatingLabelText="Default theta of the new nodes"
          value={defaultTheta}
          onChange={(e, text) => this.setState({ defaultTheta: text })}
        />
      </Dialog>
    );
  }
}

NetworkDetails.propTypes = {
  settings: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  updateNetwork: PropTypes.func.isRequired,
  configurable: PropTypes.bool.isRequired
};

export default NetworkDetails;
