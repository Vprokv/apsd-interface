import RenderOverlayMenu from '@/Components/OverlayMenu/RenderOverlayMenu'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import React from 'react'
import filterIcon from '@/Pages/Tasks/list/icons/filterIcon'
import Icon from '@Components/Components/Icon'
import LoadableButton from '../../components_ocean/Components/Button/LoadableButton'
import PropTypes from 'prop-types'

const OverlayButton = (ButtonComponent) => {
  const OverlayButton = ({ text, icon, minSize, maxSize, size, ...other }) => (
    <RenderOverlayMenu>
      {({ OverlayMenu, ...props }) => (
        <ButtonComponent {...props} {...other}>
          <Icon icon={icon} size={size} />
          <OverlayMenu minSize={minSize} maxSize={maxSize}>
            {text}
          </OverlayMenu>
        </ButtonComponent>
      )}
    </RenderOverlayMenu>
  )

  OverlayButton.propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    className: PropTypes.string,
    minSize: PropTypes.string,
    maxSize: PropTypes.string,
    size: PropTypes.number,
  }

  OverlayButton.defaultProps = {
    minSize: '100',
    className: '',
    maxSize: '150',
  }

  return OverlayButton
}

export default OverlayButton
