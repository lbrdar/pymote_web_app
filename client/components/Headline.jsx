import React, { PropTypes } from 'react';

export default class Headline extends React.Component {
  render() {
    return (
      <h1>{ this.props.children }</h1>
    );
  }
}

Headline.propTypes = {
  children: PropTypes.any.isRequired
};
