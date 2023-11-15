import React from 'react'
import PropTypes from 'prop-types'
import { LoadableBaseButton } from '@/Components/Button'
import { SidebarEntity } from '@/Pages/Tasks/item/styles'

const DocumentActions = ({ documentActions }) => (
  <>
    {documentActions.map(({ key, caption, handler, icon }) => (
      <LoadableBaseButton
        key={key}
        className="font-weight-light"
        onClick={handler}
        title={caption}
      >
        <div className="flex items-center">
          <img src={icon} alt="" className="mr-2" />
          <SidebarEntity className="break-words font-size-12 whitespace-pre-line text-left">
            {caption}
          </SidebarEntity>
        </div>
      </LoadableBaseButton>
    ))}
  </>
)

const props = PropTypes.shape({
  key: PropTypes.string.isRequired,
  captions: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
})

DocumentActions.propTypes = {
  documentActions: PropTypes.arrayOf(props),
}

DocumentActions.defaultProps = {
  documentActions: [],
}
export default React.memo(DocumentActions)
