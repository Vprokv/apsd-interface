import React from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'

const UnderButtons = ({
  leftFunc,
  leftLabel,
  rightFunc,
  rightLabel,
  leftStyle,
  rightStyle,
  className,
  children,
}) => {
  return (
    <div className={`flex items-center justify-end ${className}`}>
      {children}
      <SecondaryGreyButton className={leftStyle} onClick={leftFunc}>
        {leftLabel}
      </SecondaryGreyButton>
      <LoadableSecondaryOverBlueButton
        type="submit"
        className={rightStyle}
        onClick={rightFunc}
      >
        {rightLabel}
      </LoadableSecondaryOverBlueButton>
    </div>
  )
}

UnderButtons.defaultProps = {
  leftFunc: () => null,
  leftStyle: 'w-60 mr-4',
  rightStyle: 'w-60',
  leftLabel: 'Закрыть',
  rightFunc: () => null,
  rightLabel: 'Сохранить',
  className: PropTypes.string,
}

UnderButtons.propTypes = {
  leftFunc: PropTypes.func,
  leftLabel: PropTypes.string,
  rightFunc: PropTypes.func,
  rightLabel: PropTypes.string,
  leftStyle: PropTypes.string,
  rightStyle: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default UnderButtons
