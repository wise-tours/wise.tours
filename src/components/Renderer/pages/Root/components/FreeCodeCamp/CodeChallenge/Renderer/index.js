import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CodeChallengeRenderer extends PureComponent {

  static propTypes = {
    object: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {

    const {
      object,
    } = this.props;

    console.log('CodeChallengeRenderer object', object);

    return (
      <div>
CodeChallengeRenderer
      </div>
    );
  }
}


export default CodeChallengeRenderer;