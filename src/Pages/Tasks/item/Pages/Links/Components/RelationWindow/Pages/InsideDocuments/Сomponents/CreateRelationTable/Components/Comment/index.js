import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Input from '@/Components/Fields/Input'
import { StateRelationContext } from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/constans'

const Comment = ({ ParentValue: { id } }) => {
  const { comment, onComment } = useContext(StateRelationContext)

  return (
    <Input
      value={(comment.has(id) && comment.get(id)) || ''}
      onInput={onComment(id)}
    />
  )
}

Comment.propTypes = {
  ParentValue: PropTypes.object,
}

export default Comment
