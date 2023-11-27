import UseAutoLoadable from '@Components/Components/Inputs/Plugins/useAutoLoadable'
import { forwardRef } from 'react'
import Select from '@/Components/Inputs/Select/Select'
import {
  useLoadableSelect,
  useResolveView,
} from '@Components/Components/Inputs/Select'

const AutoLoadableSelectPlugins = [
  useLoadableSelect,
  useResolveView,
  UseAutoLoadable,
]
const ReportingSelect = forwardRef((props, ref) => (
  <Select hooks={AutoLoadableSelectPlugins} {...props} ref={ref} />
))

export default ReportingSelect
