import React from 'react';
import ReactDOM from 'react-dom';

class ResultsPage extends React.Component {
  render() {
    return (
      <div>
        Results
      </div>
    );
  }
}

ResultsPage.propTypes = {
};

ReactDOM.render(
  <ResultsPage {...window.props} />,
  document.getElementById('root')
);
