import {
  FilterObjectsWindowComponent,
  FilterWindowForm,
} from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow/styled'
import React from 'react'
import PropTypes from 'prop-types'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import Icon from '@Components/Components/Icon'
import {
  ButtonForIcon,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import Tips from '@/Components/Tips'
import filterIcon from '@/Pages/Tasks/list/icons/filterIcon'

const FilterWindow = ({ filter, setFilterValue, fields, onClose }) => (
  <div className="flex flex-col overflow-hidden h-full">
    <div className="flex overflow-hidden w-full h-full">
      <FilterWindowForm
        fields={fields}
        inputWrapper={emptyWrapper}
        value={filter}
        onInput={setFilterValue}
      />
    </div>
    <div className="flex items-center justify-between">
      <SecondaryBlueButton className="mr-2" onClick={onClose}>
        Закрыть
      </SecondaryBlueButton>
      <SecondaryGreyButton onClick={() => setFilterValue({})}>
        Очистить фильтр
      </SecondaryGreyButton>
    </div>
  </div>
)

FilterWindow.propTypes = {
  filter: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  setFilterValue: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

const FilterWindowWrapper = (props) => {
  const { onOpen, show } = props

  return (
    <>
      {!show && (
        <Tips text=" Фильтры">
          <ButtonForIcon className="mr-2" onClick={onOpen}>
            <Icon icon={filterIcon} />
          </ButtonForIcon>
        </Tips>
      )}
      <FilterObjectsWindowComponent {...props} title="Фильтры">
        <FilterWindow {...props} />
      </FilterObjectsWindowComponent>
    </>
  )
}

FilterWindowWrapper.propTypes = {
  show: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default FilterWindowWrapper
