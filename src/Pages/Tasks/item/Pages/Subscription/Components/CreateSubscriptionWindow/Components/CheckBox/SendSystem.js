import CheckBox from '../../../../../../../../../Components/Inputs/CheckBox'
import React, { useContext } from 'react'
import { SedoContext } from '../../constans'
import PropTypes from 'prop-types'

const SendSystem = ({ ParentValue: { emplId, ...item } = {} }) => {
  const { value, onInput } = useContext(SedoContext)
  return (
    <div className="flex items-center h-full justify-center w-full">
      <CheckBox
        checkBoxValue={emplId}
        key={emplId}
        value={value}
        onInput={onInput}
      />
    </div>
  )
}

export default SendSystem

SendSystem.propTypes = {
  ParentValue: PropTypes.object,
}

SendSystem.defaultProps = {
  emplId: '',
}
