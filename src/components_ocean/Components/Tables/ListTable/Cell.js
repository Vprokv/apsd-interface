import React from "react"
import PropTypes from "prop-types"

const Cell = ({ value, className }) => (
  <div className={`${className} word-wrap-anywhere`}>
    {value}
  </div>
)

Cell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
}

Cell.defaultProps = {
  className: ""
}

export default Cell
