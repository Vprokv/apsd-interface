import {
  useLoadableSelect,
  useResolveView,
  useResetSearchOnInput,
} from '@Components/Components/Inputs/Select'
import { forwardRef } from 'react'
import Select from './Select'

// добавляем контроллер loadable к селектам
export const LoadableSelectPlugins = [
  useResetSearchOnInput,
  useLoadableSelect,
  useResolveView,
]

const LoadableSelect = forwardRef((props, ref) => (
  <Select hooks={LoadableSelectPlugins} {...props} ref={ref} />
))

export default LoadableSelect
