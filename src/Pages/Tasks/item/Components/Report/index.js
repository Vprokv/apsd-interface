import React, { useState } from 'react'
import styled from 'styled-components'
import Icon from '@Components/Components/Icon'
import ShevronIcon from '@/Icons/ShevronIcon'

const Cont = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  ${(props) => !props.hidden && '-webkit-line-clamp: 4 '}
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  font-size: 12px;
`

const Report = ({ previousTaskReport: { dssReportText } = {} }) => {
  const [hidden, onHidden] = useState(true)
  return (
    <div className="bg-light-gray mx-4 p-2 ">
      <div className="flex  margin-inline-end w-full">
        <button
          type="button"
          onClick={() => onHidden((prev) => !prev)}
          className="ml-auto"
        >
          <Icon
            icon={ShevronIcon}
            className="rotate-270 color-text-secondary font-bold"
            size={10}
          />
        </button>
      </div>
      <Cont hidden={hidden}>{dssReportText}</Cont>
    </div>
  )
}

Report.propTypes = {}

export default Report
