import React, { useCallback, useEffect, useRef, useState, forwardRef , useLayoutEffect } from "react"
import PropTypes from "prop-types"
import FillIndicator from '../Input/FillIndicator'
import { Container } from "../Input"
import { TextArea } from "./styles"

export { Container, TextArea }

const TextInput = forwardRef(({
 children, className, minHeight, maxHeight, id, disabled, autoComplete, placeholder, name, onInput,
 onBlur, onFocus, onKeyUp, value, ShowInputFillIndicator, maxlength, autosize
}, ref) => {
  const [height, setHeight] = useState("")
  const [textAreaHeight, setTextAreaHeight] = useState("")
  const [sizeDiff, setSizeDiff] = useState(0)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (autosize) {
      setSizeDiff(containerRef.current.offsetHeight - inputRef.current.offsetHeight)
      setTextAreaHeight("auto")
    }
  }, [autosize, value])

  useLayoutEffect (() => {
    if (textAreaHeight !== "100%") {
      let contentHeight = inputRef.current.scrollHeight + sizeDiff
      if (minHeight) {
        contentHeight = contentHeight < minHeight ? minHeight : contentHeight
      }
      if (maxHeight) {
        if (contentHeight > maxHeight) {
          contentHeight = maxHeight
        }
      }
      setHeight(`${contentHeight}px`)
      setTextAreaHeight("100%")
    }
  }, [sizeDiff, maxHeight, minHeight, textAreaHeight])

  const handleKeyDown = useCallback((e) => {
    const {key, ctrlKey} = e
    if (key !== "Enter" || !ctrlKey) {
      e.stopPropagation()
    }
  }, [])

  const onChange = useCallback(({target: {value, id}}) => {
    onInput(value, id)
  }, [onInput]);

  useEffect(() => {
    if (ref) {
      ref.current = inputRef.current
    }
  })

  return (
    <Container
      ref={containerRef}
      className={`${className} flex items-center justify-center`}
      style={{ minHeight, height }}
    >
      <FillIndicator
        value={value}
        ShowInputFillIndicator={ShowInputFillIndicator}
        maxlength={maxlength}
      >
        <TextArea
          id={id}
          ref={inputRef}
          value={value}
          maxLength={maxlength}
          textAreaHeight={textAreaHeight}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={onChange}
          onKeyUp={onKeyUp}
          name={name}
        />
      </FillIndicator>
      {children}
    </Container>
  )
})

TextInput.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  maxlength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autosize: PropTypes.bool,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  onKeyUp: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  autoComplete: PropTypes.string,
  ShowInputFillIndicator: PropTypes.bool,
}

TextInput.defaultProps = {
  value: "",
  autoComplete: "off",
  maxHeight: 350,
  placeholder: "",
  className: "",
  ShowInputFillIndicator: true
}

export default TextInput
