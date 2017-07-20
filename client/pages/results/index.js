import React from 'react';
import ReactDOM from 'react-dom';

class ResultsPage extends React.Component {
  render() {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}

ResultsPage.propTypes = {
  title: React.PropTypes.string.isRequired
};

ReactDOM.render(
  <ResultsPage {...window.props} />,
  window.react_mount
);
