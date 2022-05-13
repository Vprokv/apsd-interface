/* eslint-disable react/button-has-type */
import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Icon from '../Icon'
import { preloader } from "../../Icons/preloader"

import { Button } from "./styles";
export { Button }

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`


const BaseButton = ({
  className, loading, children, disabled, onClick, onMouseDown, onMouseUp, type, style, name, id
}) => (
  <Button
    className={`${className} relative`}
    disabled={disabled}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    type={type}
    style={style}
    name={name}
    id={id}
  >
    {loading && (
      <LoaderContainer className="flex justify-center items-center pointer-events-none">
        <Icon size="25" className="color-lightGold" icon={preloader} />
      </LoaderContainer>
    )}
    {children}
  </Button>
)

BaseButton.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  style: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string,
}

BaseButton.defaultProps = {
  className: "",
  classNameChildren: "",
  type: "button"
}

export default BaseButton
