import React from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'

const UnderButtons = ({ leftFunc, leftLabel, rightFunc, rightLabel }) => {
  return (
    <div className="flex items-center justify-end mt-8">
      <SecondaryGreyButton className="w-60 mr-4" onClick={leftFunc}>
        {leftLabel}
      </SecondaryGreyButton>
      <SecondaryOverBlueButton className="w-60" onClick={rightFunc}>
        {rightLabel}
      </SecondaryOverBlueButton>
    </div>
  )
}

UnderButtons.defaultProps = {
  leftFunc: () => null,
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
