import React, { PropTypes } from 'react';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import styles from './style';

class Algorithm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };
  }

  render() {
    const { algorithm, algorithm2 } = this.props;
    return (
      <Paper zDepth={2} style={styles.algorithmsContainer}>
        <Card>
          <CardHeader
            title={algorithm.label}
            titleStyle={styles.algorithmLabel}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <pre style={styles.code}>{algorithm.code}</pre>
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title={algorithm2.label}
            titleStyle={styles.algorithmLabel}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <pre style={styles.code}>{algorithm2.code}</pre>
          </CardText>
        </Card>
      </Paper>
    );
  }
}

Algorithm.propTypes = {
  algorithm: PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  }).isRequired,
  algorithm2: PropTypes.shape({
    label: PropTypes.string,
    code: PropTypes.string
  }).isRequired
};

export default Algorithm;
