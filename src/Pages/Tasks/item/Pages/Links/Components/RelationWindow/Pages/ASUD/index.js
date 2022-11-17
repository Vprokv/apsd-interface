import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {StateContext} from "@/Pages/Tasks/item/Pages/Links/constans";

const DocumentASUD = (props) => {
  const close = useContext(StateContext)
  const state = []
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex  h-full">DocumentASUD</div>
      <UnderButtons leftFunc={close} rightLabel="Cвязать" />
    </div>
  )
}

DocumentASUD.propTypes = {}

export default DocumentASUD
