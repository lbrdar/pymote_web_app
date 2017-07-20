import React from 'react';
import ReactDOM from 'react-dom';

class AlgorithmPage extends React.Component {
  render() {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}

AlgorithmPage.propTypes = {
  title: React.PropTypes.string.isRequired
};

ReactDOM.render(
  <AlgorithmPage {...window.props} />,
  document.getElementById('root')
);
