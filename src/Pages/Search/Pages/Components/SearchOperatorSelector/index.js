import { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import Select from '@/Components/Inputs/Select'
import { OperatorContainer } from './styles'

const SearchOperatorSelector = memoize((Component) => {
  const SearchOperatorSelector = forwardRef(
    (
      {
        className,
        style,
        operatorOptions: { options, defaultOption },
        id,
        onInput,
        value: fullValue,
        value: { operator = defaultOption, value } = {},
        ...props
      },
      ref,
    ) => {
      const handleInput = useCallback(
        (fieldValue, fieldId) => {
          onInput({ ...fullValue, [fieldId]: fieldValue }, id)
        },
        [fullValue, id, onInput],
      )
      return (
        <OperatorContainer className={className} style={style}>
          <Component
            ref={ref}
            {...props}
            id="value"
            onInput={handleInput}
            className="mr-4"
            value={value}
          />
          <Select
            className="w-60 flex-0"
            id="operator"
            onInput={handleInput}
            value={operator}
            options={options}
            clearable={false}
            valueKey="ID"
            labelKey="SYS_NAME"
          />
        </OperatorContainer>
      )
    },
  )

  SearchOperatorSelector.propTypes = {
    id: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
  }

  SearchOperatorSelector.defaultProps = {
    value: {},
    className: '',
  }

  return SearchOperatorSelector
})

export default SearchOperatorSelector
