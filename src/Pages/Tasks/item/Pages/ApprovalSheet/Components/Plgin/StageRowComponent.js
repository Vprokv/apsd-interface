import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Tree from '@Components/Components/Tree'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import log from 'tailwindcss/lib/util/log'

const StageRowComponent = ({ node }) => {
  const { index, term } = node

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="mr-4">{`Этап №${index}`}</div>
        <div className="mr-4">{`Срок (дней): ${term}`}</div>
        <div>{`Дата завершения: `}</div>
      </div>
    </div>
  )
}

StageRowComponent.propTypes = {}

export default StageRowComponent
