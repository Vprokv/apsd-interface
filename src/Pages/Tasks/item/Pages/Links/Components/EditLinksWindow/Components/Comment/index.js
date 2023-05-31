import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import Input from '@/Components/Fields/Input'
import { EditLinkContext } from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/constans'

const Comment = ({ ParentValue: { contentId, comment: defaultComment } }) => {
  const { comment, onComment } = useContext(EditLinkContext)

  const value = useMemo(
    () => (comment.has(contentId) && comment.get(contentId)) || defaultComment,
    [contentId, comment, defaultComment],
  )

  return (
    <Input
      className="flex items-center w-24"
      value={value}
      onInput={onComment()(contentId)}
    />
  )
}

Comment.propTypes = {
  ParentValue: PropTypes.object,
}

export default Comment
