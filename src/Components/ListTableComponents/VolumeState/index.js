import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import Icon from '@Components/Components/Icon'
import documentIcon from '../../../Icons/documentIcon'
import colorFromString from "@Components/Utils/colorFromString";
import {VolumeStatus} from "./styles";
import dayjs from "dayjs";
import {DEFAULT_DATE_FORMAT, PRESENT_DATE_FORMAT} from "../../../contants";

const VolumeState = ({ ParentValue: { documentRegNumber, display, creationDate } }) => {

  const color = useMemo(() => {
    return colorFromString(display, 100, 35)
  }, [display])

  const bg = useMemo(() => {
    return `${color.slice(0, 3)}a${color.slice(3, -1)}, 0.1)`
  }, [color])

  return (
    <div className="flex flex-col w-min">
      <VolumeStatus
        className="font-size-14 mb-1 font-medium px-1 py-0.5 rounded-md w-fit"
        color={color}
        bg={bg}
        dangerouslySetInnerHTML={{ __html: useMemo(() => display.replaceAll("-", "&#x2011"), [display]) }}
      />
      <div className="flex items-center font-size-12">
        <div className="flex items-center justify-center mr-2 whitespace-nowrap">
          <Icon icon={documentIcon} size={14} className="mr-1 color-text-secondary"/>
          {documentRegNumber}
        </div>
        <div>
          <span className="mr-2">от</span>
          {useMemo(() => dayjs(creationDate, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT), [creationDate])}
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