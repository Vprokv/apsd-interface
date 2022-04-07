import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Icon from '@Components/Components/Icon'
import documentIcon from '../../../Icons/documentIcon'
import colorFromString from "@Components/Utils/colorFromString";
import {VolumeStatus} from "./styles";

const VolumeState = ({ ParentValue: { id, type, dateStart } }) => {
  const color = useMemo(() => {
    return colorFromString(type, 100, 40)
  }, [type])

  const bg = useMemo(() => {
    return `${color.slice(0, 3)}a${color.slice(3, -1)}, 0.1)`
  }, [color])

  return (
    <div className="flex flex-col w-min">
      <VolumeStatus
        className="font-size-14 mb-1 font-medium px-1 py-0.5 rounded-md "
        color={color}
        bg={bg}
        dangerouslySetInnerHTML={{ __html: useMemo(() => type.replaceAll("-", "&#x2011"), [type]) }}
      />
      <div className="flex items-center font-size-12">
        <div className="flex items-center justify-center mr-2">
          <Icon icon={documentIcon} size={14} className="mr-1 color-text-secondary"/>
          {id}
        </div>
        <div>
          <span className="mr-2">от</span>
          {dateStart}
        </div>
      </div>
    </div>
  );
};

VolumeState.propTypes = {

};

export default VolumeState;
// Компонент сдизайнен для компонента ListTable и это его пропорции
export const sizes = {
  min: "200px",
  max: "3.2fr"
}