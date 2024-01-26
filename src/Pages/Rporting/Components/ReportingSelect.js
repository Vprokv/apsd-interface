import UseAutoLoadable from '@Components/Components/Inputs/Plugins/useAutoLoadable'
import { forwardRef } from 'react'
import Select from '@/Components/Inputs/Select/Select'
import {
  useLoadableSelect,
  useResolveView,
} from '@Components/Components/Inputs/Select'
import styled from 'styled-components'
import { BasicMultipleOptionContainer } from '../../../components_ocean/Components/Inputs/Select'

const AutoLoadableSelectPlugins = [
  useLoadableSelect,
  useResolveView,
  UseAutoLoadable,
]

export const StyledOptionContainer = styled(BasicMultipleOptionContainer)`
  --multipleSelectedOptionContainer: 380px;
`

const ReportingSelect = forwardRef((props, ref) => (
  <Select
    hooks={AutoLoadableSelectPlugins}
    {...props}
    multipleOptionsComponent={StyledOptionContainer}
    ref={ref}
  />
))

export default ReportingSelect
