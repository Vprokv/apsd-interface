import React from 'react'
import PropTypes from 'prop-types'
import Select from './Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { SearchButton } from './UserSelect'

const DocumentSelect = (props) => {
  return (
    <div className="flex items-center w-full">
      <Select {...props} />
      <SearchButton className="ml-1">
        <Icon icon={searchIcon} />
      </SearchButton>
    </div>
  )
}

DocumentSelect.propTypes = {}

export default DocumentSelect
