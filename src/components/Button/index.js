import React from 'react';
import Loading from '../Loading';
// import PropTypes from 'prop-types';

const Button = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
};

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

export const ButtonWithLoading = withLoading(Button);

// Button.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   className: PropTypes.string,
//   children: PropTypes.node.isRequired
// };

// Button.defaultProps = {
//   className: ''
// };

export default Button;
