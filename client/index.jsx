import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

class PymoteWebApp extends React.Component {
  render() {
    return (
      <App />
    );
  }
}

render(<PymoteWebApp />, document.getElementById('PymoteWebApp'));
