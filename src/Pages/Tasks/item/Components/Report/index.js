import React from 'react'
import styled from 'styled-components'

const Cont = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  margin: 0 20px 0 20px;
  font-size: 12px;
  background-color: var(--light-gray);
`

const Report = ({ previousTaskReport }) => {
  return <Cont>{previousTaskReport?.dssReportText}</Cont>
}

Report.propTypes = {}

export default Report
