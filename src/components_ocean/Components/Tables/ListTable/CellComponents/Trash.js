import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { TrashIcon } from "@/Components/Icon/CommonIcons"

const Trash = ({ formPayload, onDelete }) => (
  <TrashIcon
    onClick={useCallback(() => onDelete(formPayload), [formPayload, onDelete])}
  />
)

Trash.propTypes = {
  formPayload: PropTypes.object,
  onDelete: PropTypes.func,
}

export default Trash
