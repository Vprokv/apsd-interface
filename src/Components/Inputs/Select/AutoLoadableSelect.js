import UseAutoLoadable from '@Components/Components/Inputs/Plugins/useAutoLoadable'
import { forwardRef } from 'react'
import Select from './Select'
import { LoadableSelectPlugins } from './LoadableSelect'

// добавлем автолодабл версию(load on render once) к LoadableSelect
const AutoLoadableSelectPlugins = [...LoadableSelectPlugins, UseAutoLoadable]
const AutoLoadableSelect = forwardRef((props, ref) => (
  <Select hooks={AutoLoadableSelectPlugins} {...props} ref={ref} />
))

export default AutoLoadableSelect
