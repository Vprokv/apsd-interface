import React from 'react'
import PropTypes from 'prop-types'
import SelectComponent, { DropDownInput } from '@Components/Components/Inputs/Select'
import Loadable from '@Components/Components/Inputs/Loadable'
import Icon from '@Components/Components/Icon'
import angleIcon from "@/Icons/angleIcon"
import closeIcon from "@/Icons/closeIcon"
import styled from "styled-components"

const StyledSelect = styled(SelectComponent)`
  --padding-input: 5px 10px 5px 16px;
  ${DropDownInput} {
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98A5BC;
    }
  }
`

const ToggleIndicatorIconComponent = () => <Icon icon={angleIcon} className="color-text-secondary" size={12} />
const RemoveIconComponent = () => <Icon icon={closeIcon} className="color-text-secondary mr-1" size={10} />

export const Select = props => <StyledSelect
  ToggleIndicatorIconComponent={ToggleIndicatorIconComponent}
  RemoveIconComponent={RemoveIconComponent}
  {...props}
/>

const LoadableSelect = Loadable(Select)

export default LoadableSelect