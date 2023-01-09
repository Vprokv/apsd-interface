import React from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
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
}) => {
  return (
    <div className="flex items-center justify-end mt-8">
      <SecondaryGreyButton className={leftStyle} onClick={leftFunc}>
        {leftLabel}
      </SecondaryGreyButton>
      <SecondaryOverBlueButton className={rightStyle} onClick={rightFunc}>
        {rightLabel}
      </SecondaryOverBlueButton>
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
}

UnderButtons.propTypes = {
  leftFunc: PropTypes.func,
  leftLabel: PropTypes.string,
  rightFunc: PropTypes.func,
  rightLabel: PropTypes.string,
}

export default UnderButtons
