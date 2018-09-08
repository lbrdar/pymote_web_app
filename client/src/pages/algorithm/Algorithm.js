import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import styles from './style';

class Algorithm extends React.Component {
  renderTitle = (algorithm) => {
    const isSelected = this.props.selected && (this.props.selected.label === algorithm.label);
    return (
      <div style={styles.algorithmLabelContainer}>
        <p style={styles.algorithmLabel}>{algorithm.label}</p>
        {!isSelected && <FlatButton label="Select" onClick={() => this.props.onSelect(algorithm)} />}
      </div>
    );
  };

  renderAlgorithm = (algorithm, index) => {
    const isSelected = this.props.selected && (this.props.selected.label === algorithm.label);
    return (
      <Card key={index}>
        <CardHeader
          title={this.renderTitle(algorithm)}
          style={{ border: isSelected ? '4px solid red' : 'none' }}
          textStyle={{ width: '100%' }}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <pre style={styles.code}>{algorithm.code}</pre>
        </CardText>
      </Card>
    );
  };

  render() {
    return (
      <Paper zDepth={2} style={styles.algorithmsContainer}>
        { this.props.algorithms.map(this.renderAlgorithm) }
      </Paper>
    );
  }
}

Algorithm.propTypes = {
  algorithms: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  })).isRequired,
  selected: PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  }),
  onSelect: PropTypes.func.isRequired
};

Algorithm.defaultProps = {
  selected: null
};

export default Algorithm;
