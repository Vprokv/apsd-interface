import React from 'react';
import PropTypes from 'prop-types';

const NoOptionPlaceholder = ({ loading, search }) => {
  return (
    <div className="p-2">
      {loading ? "Download..." : search ? "Nothing found" : "Enter your request"}
    </div>
  );
};

NoOptionPlaceholder.propTypes = {
  loading: PropTypes.bool,
  search: PropTypes.string,
};

export default React.memo(NoOptionPlaceholder);