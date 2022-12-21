import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ButtonsForHiddenText from '@/Components/Button'

const HideAndShowText = ({
  className,
  value,
  numberOfCharactersDisplayed,
  buttonComponent: ButtonComponent,
}) => {
  const [showText, updateShowText] = useState(true)

  const valueOutput = useMemo(
    () =>
      showText && value?.length > numberOfCharactersDisplayed
        ? `${value?.slice(0, numberOfCharactersDisplayed)}...`
        : value,
    [showText, value, numberOfCharactersDisplayed],
  )

  const hideText = useCallback(
    () => updateShowText(!showText),
    [showText, updateShowText],
  )
  return (
    <div className={className}>
      <div className="word-break-all">{valueOutput}</div>
      {value.length > numberOfCharactersDisplayed && (
        <button type="button" onClick={hideText}>
          <ButtonComponent className="color-lightGold" showText={showText} />
        </button>
      )}
    </div>
  )
}

HideAndShowText.propTypes = {
  buttonComponent: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
  numberOfCharactersDisplayed: PropTypes.number,
}
HideAndShowText.defaultProps = {
  value: '',
  numberOfCharactersDisplayed: 360,
  buttonComponent: ButtonsForHiddenText,
}
export default HideAndShowText
