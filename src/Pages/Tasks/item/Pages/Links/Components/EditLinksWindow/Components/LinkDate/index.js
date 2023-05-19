import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import DatePicker from '@Components/Components/Inputs/DatePicker'
import { EditLinkContext } from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/constans'

const LinkDate = ({ ParentValue: { contentId, linkDate } }) => {
  const { date, onDate } = useContext(EditLinkContext)

  const value = useMemo(
    () => (date.has(contentId) && date.get(contentId)) || linkDate,
    [date, contentId, linkDate],
  )

  return <DatePicker value={value} onInput={onDate()(contentId)} />
}

LinkDate.propTypes = {
  ParentValue: PropTypes.object,
}

export default LinkDate
