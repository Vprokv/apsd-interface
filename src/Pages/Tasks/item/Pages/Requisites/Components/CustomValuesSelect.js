import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CustomValuesContext } from '../constants'
import Input from '@Components/Components/Inputs/Input'
import Select from '@/Components/Inputs/Select'
import TextArea from '@Components/Components/Inputs/TextArea'
import UserSelect from '@/Components/Inputs/UserSelect'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'
import Classification from './Classification'

const useCustomOptions = (id, value) => {
  const customValues = useContext(CustomValuesContext)
  return useMemo(() => {
    const v = customValues[id] || null
    return v ? (Array.isArray(v) ? v : typeof v === "object" ? [v] : [{[value]: v}]) : []
  }, [customValues, id])
}

const WithCustomValuesSelect = (Component) => {
  const CustomValuesSelect = (props) => {
    const customOptions = useCustomOptions(props.id, props.value)
    return (
      <Component
        {...props}
        value={props.value === null ? undefined : props.value}
        options={customOptions}
      />
    )
  }

  CustomValuesSelect.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return CustomValuesSelect
}

const WithCustomValuesUserSelect = (Component) => {
  const CustomValuesSelect = (props) => {
    const customOptions = useCustomOptions(props.id, props.value)
    const options = useMemo(
      () => customOptions.map(AddUserOptionsFullName),
      [customOptions],
    )
    return (
      <Component
        {...props}
        value={props.value === null ? undefined : props.value}
        options={options}
      />
    )
  }

  CustomValuesSelect.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return CustomValuesSelect
}

const WithCustomValuesInput = (Component) => {
  const CustomValuesInput = (props) => {
    const customOptions = useCustomOptions(props.id, props.value)
    return (
      <Component
        {...props}
        value={customOptions.length > 0 ? customOptions[0][props.value] : props.value}
      />
    )
  }

  CustomValuesInput.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return CustomValuesInput
}

export const CustomValuesSelect = WithCustomValuesSelect(Select)
export const CustomValuesOrgStructure = WithCustomValuesUserSelect(UserSelect)
export const CustomValuesClassification = WithCustomValuesInput(Classification)
export const CustomValuesInput = WithCustomValuesInput(Input)
export const CustomValuesTextArea = WithCustomValuesInput(TextArea)

