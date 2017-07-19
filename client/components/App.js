import React from 'react';
import Headline from './Headline';

const styles = {
  button: {
    cursor: 'pointer',
  },
  counter: {
    color: 'blue',
    fontSize: '20px',
  }
};

export default class App extends React.Component {

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12'>
            <Headline>Sample App!</Headline>
            <div style={[styles.button]}>INCREASE</div>
            <p style={[styles.counter]}>{0}</p>
            <p>{process.env.BASE_API_URL}</p>
          </div>
        </div>
      </div>
    );
  }
}
