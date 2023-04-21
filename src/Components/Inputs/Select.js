import SelectController, {
  Input,
  LoadableAdapterSelect,
  MultipleSelect,
  RenderMultipleValueSelectInput,
  SelectComponent,
} from '@Components/Components/Inputs/Select'
import Loadable from '@Components/Components/Inputs/Loadable'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import closeIcon from '@/Icons/closeIcon'
import styled from 'styled-components'
import AutoLoadable from '@Components/Components/Inputs/AutoLoadable'

const StyledSelect = styled(SelectComponent)`
  --padding-input: 5px 10px 5px 16px;

  ${Input} {
    text-overflow: ellipsis;

    overflow: hidden;
    white-space: nowrap;
    
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`

const ToggleIndicatorIconComponent = () => (
  <Icon icon={angleIcon} className="color-text-secondary" size={12} />
)
const RemoveIconComponent = () => (
  <Icon icon={closeIcon} className="color-text-secondary" size={12} />
)
// делаем мультипл версию базового селекта
const BaseMultipleSelect = MultipleSelect(StyledSelect)

// кофигурируем сам компонент селекта
const Select = (props) => (
  <SelectController
    multipleSelectComponent={BaseMultipleSelect}
    singleSelectComponent={StyledSelect}
    toggleIndicatorIconComponent={ToggleIndicatorIconComponent}
    removeIconComponent={RemoveIconComponent}
    {...props}
  />
)

// кастомизируем view инпута селекта
const AlwaysRenderValuesMultipleSelect = (props) => (
  <BaseMultipleSelect
    {...props}
    inputComponent={RenderMultipleValueSelectInput}
  />
)

// создаем LoadableSelect(адаптеры к Loadable контроллерам) версии всех этих селектов
const LoadableMultiSelect = LoadableAdapterSelect(BaseMultipleSelect)
const LoadableSelectComponent = LoadableAdapterSelect(StyledSelect)
const LoadableAlwaysRenderValuesMultipleSelect = LoadableAdapterSelect(
  AlwaysRenderValuesMultipleSelect,
)

// добавляем контроллер loadable к селектам
const LoadableSelect = Loadable((props) => (
  <Select
    multipleSelectComponent={LoadableMultiSelect}
    singleSelectComponent={LoadableSelectComponent}
    {...props}
  />
))

// добавляем контроллер loadable к селектам и кастомный рендер Multiple версии
const LoadableAlwaysRenderValuesSelect = Loadable((props) => (
  <Select
    multipleSelectComponent={LoadableAlwaysRenderValuesMultipleSelect}
    singleSelectComponent={LoadableSelectComponent}
    {...props}
  />
))

// добавлем автолодабл версию(load on render once) к LoadableSelect
const AutoLoadableMultipleSelect = AutoLoadable(LoadableMultiSelect)
const WithAutoLoadableSelect = AutoLoadable(LoadableSelectComponent)

// подключаем контроллер loadable
const AutoLoadableSelect = Loadable((props) => (
  <Select
    multipleSelectComponent={AutoLoadableMultipleSelect}
    singleSelectComponent={WithAutoLoadableSelect}
    {...props}
  />
))

export { Select, LoadableAlwaysRenderValuesSelect, AutoLoadableSelect }

export default LoadableSelect
