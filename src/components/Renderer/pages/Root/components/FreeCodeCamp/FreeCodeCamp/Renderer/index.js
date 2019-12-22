import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ChallengesRenderer from './Challenges';

class FreeCodeCampRenderer extends PureComponent {

  static propTypes = {
    blocks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired).isRequired,
  };

  render() {

    const {
      blocks,
    } = this.props;

    return (
      <ul>
        {blocks.map((n, index) => {

          const {
            id,
            name,
            Children,
          } = n;

          return <li
            key={id || index}
          >
            {name}

            <ul>
              {Children.map((nn, index2) => {

                const {
                  id,
                  name,
                  Challenges,
                } = nn;

                return <li
                  key={id || index2}
                >
                  <ChallengesRenderer
                    name={name}
                    challenges={Challenges}
                  />

                </li>

              })}
            </ul>
          </li>

        })}
      </ul>
    );
  }
}


export default FreeCodeCampRenderer;