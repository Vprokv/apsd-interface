import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CreateTechnicalObjectsWindowComponent,
  FilterWindowForm,
} from '@/Pages/Settings/Components/TechnicalObjects/styles'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import LoadableSelect, { AutoLoadableSelect } from '@/Components/Inputs/Select'
import {
  URL_ENTITY_LIST,
  URL_TECHNICAL_OBJECTS_CREATE,
  URL_TECHNICAL_OBJECTS_UPDATE,
} from '@/ApiList'
import { ApiContext, SETTINGS_TECHNICAL_OBJECTS } from '@/contants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'

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

const EditTechnicalObjectWindow = ({ onClose, selected, ...props }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState(selected[0])
  const getNotification = useOpenNotification()
  const { setTabState } = useTabItem({ stateId: SETTINGS_TECHNICAL_OBJECTS })

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
        component: AutoLoadableSelect,
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
        component: AutoLoadableSelect,
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
        component: AutoLoadableSelect,
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
        component: AutoLoadableSelect,
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
        component: AutoLoadableSelect,
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
    ],
    [api],
  )

  const onUpdate = useCallback(async () => {
    try {
      const response = await api.post(URL_TECHNICAL_OBJECTS_UPDATE, filter)
      getNotification(customMessagesFuncMap[response.status]())
      setTabState({ loading: false, fetched: false })

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
        title="Редактирование технического объекта"
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
          <LoadableSecondaryOverBlueButton className=" w-64" onClick={onUpdate}>
            Сохранить
          </LoadableSecondaryOverBlueButton>
        </div>
      </CreateTechnicalObjectsWindowComponent>
    </div>
  )
}

EditTechnicalObjectWindow.propTypes = {}

export default EditTechnicalObjectWindow
