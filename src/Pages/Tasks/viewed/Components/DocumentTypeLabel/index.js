import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import colorFromString from '@Components/Utils/colorFromString'
import { VolumeStatus } from '@/Components/ListTableComponents/VolumeState/styles'

const TypeLabelComponent = ({ ParentValue: { typeLabel } }) => {
  const color = useMemo(() => {
    return colorFromString(typeLabel, 100, 35)
  }, [typeLabel])

  const bg = useMemo(() => {
    return `${color.slice(0, 3)}a${color.slice(3, -1)}, 0.1)`
  }, [color])

  return (
    <div className="flex  w-full h-full items-center ">
      <VolumeStatus
        className="font-size-12 mb-1 font-medium px-1 py-0.5 rounded-md w-fit"
        color={color}
        bg={bg}
        dangerouslySetInnerHTML={{
          __html: useMemo(
            () => typeLabel.replaceAll('-', '&#x2011'),
            [typeLabel],
          ),
        }}
      />
    </div>
  )
}

TypeLabelComponent.propTypes = {
  ParentValue: PropTypes.object,
}

export default TypeLabelComponent
// Компонент сдизайнен для компонента ListTable и это его пропорции
export const sizes = 200
