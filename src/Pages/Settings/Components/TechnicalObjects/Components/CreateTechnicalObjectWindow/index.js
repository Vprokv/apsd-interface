import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CreateTechnicalObjectsWindowComponent,
  FilterWindowForm,
} from '@/Pages/Settings/Components/TechnicalObjects/styles'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST, URL_TECHNICAL_OBJECTS_CREATE } from '@/ApiList'
import { ApiContext, SETTINGS_TECHNICAL_OBJECTS } from '@/contants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
  typeObjectId: [{ name: VALIDATION_RULE_REQUIRED }],
  voltageId: [{ name: VALIDATION_RULE_REQUIRED }],
  balKeeperId: [{ name: VALIDATION_RULE_REQUIRED }],
  resId: [{ name: VALIDATION_RULE_REQUIRED }],
  address: [{ name: VALIDATION_RULE_REQUIRED }],
}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Технический объект создан успешно',
    }
  },
}

const CreateTechnicalObjectWindow = ({ onClose, ...props }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({ stateId: SETTINGS_TECHNICAL_OBJECTS })

  const filterFormConfig = useMemo(
    () => [
      {
        id: 'name',
        component: SearchInput,
        placeholder: 'Наименование',
        label: 'Наименование',
      },
      {
        id: 'code',
        component: SearchInput,
        placeholder: 'Код',
        label: 'Код',
      },
      {
        id: 'typeObjectId',
        component: LoadableSelect,
        placeholder: 'Тип объекта',
        label: 'Тип объекта',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tech_obj_type_catalog',
            query,
          })
          return data
        },
      },
      {
        id: 'voltageId',
        component: LoadableSelect,
        placeholder: 'Класс напряжения',
        label: 'Класс напряжения',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_voltage',
            query,
          })
          return data
        },
      },
      {
        id: 'balKeeperId',
        component: LoadableSelect,
        placeholder: 'Балансодержатель',
        label: 'Балансодержатель',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_branch',
            query,
          })
          return data
        },
      },
      {
        id: 'resId',
        component: LoadableSelect,
        placeholder: 'РЭС',
        label: 'РЭС',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_res',
            query,
          })
          return data
        },
      },
      {
        id: 'address',
        component: LoadableSelect,
        placeholder: 'Адрес',
        label: 'Адрес',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tech_obj_type_catalog',
            query,
          })
          return data
        },
      },
    ],
    [api],
  )

  const onCreate = useCallback(async () => {
    try {
      const response = await api.post(URL_TECHNICAL_OBJECTS_CREATE, filter)
      getNotification(customMessagesFuncMap[response.status]())
      setTabState(setUnFetchedState())

      onClose()
    } catch (e) {
      const { response: { status = 500, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, filter, getNotification, onClose, setTabState])

  return (
    <div>
      <CreateTechnicalObjectsWindowComponent
        {...props}
        onClose={onClose}
        title="Добавление технического объекта"
      >
        <FilterWindowForm
          inputWrapper={DefaultWrapper}
          fields={filterFormConfig}
          value={filter}
          onInput={setFilter}
          rules={rules}
        />
        <div className="flex justify-end form-element-sizes-40 mt-4">
          <SecondaryGreyButton className="ml-2 w-64" onClick={onClose}>
            Отменить
          </SecondaryGreyButton>
          <LoadableSecondaryOverBlueButton className=" w-64" onClick={onCreate}>
            Сохранить
          </LoadableSecondaryOverBlueButton>
        </div>
      </CreateTechnicalObjectsWindowComponent>
    </div>
  )
}

CreateTechnicalObjectWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default CreateTechnicalObjectWindow
