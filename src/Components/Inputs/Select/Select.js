import BaseSelect from '@Components/Components/Inputs/Select'

import { forwardRef } from 'react'
import {
  RemoveIconComponent,
  StyledSelect,
  ToggleIndicatorIconComponent,
} from './style'

// стилизуем компонент селекта
const Select = forwardRef((props, ref) => (
  <BaseSelect
    ref={ref}
    component={StyledSelect}
    toggleIndicatorIconComponent={ToggleIndicatorIconComponent}
    removeIconComponent={RemoveIconComponent}
    {...props}
  />
))

export default Select
