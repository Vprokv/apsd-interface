import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CustomValuesContext } from '../constants'
import Select from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { AddUserOptionsFullName } from '../../../../../../Components/Inputs/UserSelect'
import Classification from './Classification'

const useCustomOptions = (id) => {
  const customValues = useContext(CustomValuesContext)
  return useMemo(() => {
    const v = customValues[id]
    return v ? (Array.isArray(v) ? v : [v]) : []
  }, [customValues, id])
}

const WithCustomValuesSelect = (Component) => {
  const CustomValuesSelect = (props) => {
    const customOptions = useCustomOptions(props.id)
    return (
      <Component
        {...props}
        value={props.value === null ? customOptions : props.value}
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
    const customOptions = useCustomOptions(props.id)
    const options = useMemo(
      () => customOptions.map(AddUserOptionsFullName),
      [customOptions],
    )
    return (
      <Component
        {...props}
        value={props.value === null ? customOptions : props.value}
        options={options}
      />
    )
  }

  CustomValuesSelect.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return CustomValuesSelect
}

export const CustomValuesSelect = WithCustomValuesSelect(Select)
export const CustomValuesOrgStructure = WithCustomValuesUserSelect(UserSelect)
export const CustomValuesClassification = WithCustomValuesSelect(Classification)
