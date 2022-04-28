import React from 'react';
import Icon from "../../Icon";
import {removeIcon} from "../../../Icons/removeIcon";
import { toggleIndicator} from "../../../Icons/toggleIndicator";
import styled from "styled-components";

const ToggleIconContainer = styled(Icon)`
  position: absolute;
  right: 8px;
`

export const RemoveIcon = props => {
  return <Icon icon={removeIcon} {...props} />
};

export const ToggleIndicatorIcon = props => {
  return <Icon
    size="14"
    icon={toggleIndicator}
    {...props}
  />
};