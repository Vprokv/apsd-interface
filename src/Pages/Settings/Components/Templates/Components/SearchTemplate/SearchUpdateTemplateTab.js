import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import useParseConfig from '@/Utils/Parser'
import { searchParserStages } from '@/Pages/Search/Parser'
import attributesAdapter from '@/Pages/Search/Parser/attributesAdapter'
import {
  URL_CREATE_UPDATE,
  URL_SEARCH_ATTRIBUTES,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import ScrollBar from '@Components/Components/ScrollBar'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import {
  parseSettingsFuncMap,
  TemplateTabStateContext,
} from '@/Pages/Settings/Components/Templates/constans'
import { useNavigate } from 'react-router-dom'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'

const defaultOptions = [
  {
    typeName: 'ddt_project_calc_type_doc',
    typeLabel: 'Том',
  },
]

const SearchUpdateTemplateTab = ({
  dss_name,
  dss_json,
  dsid_template,
  type,
  ...other
}) => {
  const [filter, setFilter] = useState(JSON.parse(dss_json))
  const api = useContext(ApiContext)
  const [attributes, setAttributes] = useState([])
  const { onInput } = useContext(TemplateTabStateContext)
  const { 1: setTabState } = useTabItem({ stateId: SETTINGS_TEMPLATES })
  const navigate = useNavigate()
  const getNotification = useOpenNotification()

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

  const { fields: parsedFields } = useParseConfig({
    value: filter,
    stages: searchParserStages,
    fieldsDesign: useMemo(
      () => attributes.map(attributesAdapter),
      [attributes],
    ),
  })

  const fields = useMemo(
    () => [
      {
        id: 'type',
        component: AutoLoadableSelect,
        placeholder: 'Выберите тип документа',
        label: 'Выберите тип документа',
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options: defaultOptions,
        loadFunction: async () => {
          const { data } = await api.post(
            `${URL_TYPE_CONFIG}?limit=100&offset=0`,
            {
              type: 'documentType',
              id: 'types',
              filters: {},
              sortType: null,
            },
          )
          return data
        },
      },
      ...parsedFields,
    ],
    [api, parsedFields],
  )

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
        type: filter.type,
      })

      setAttributes(data)
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter.type, getNotification])

  const reverseParseFromBackend = useMemo(() => {
    const { branchesAccess, usersAccess, dsb_private } = other
    if (dsb_private) {
      return { privateAccess: 'user' }
    } else if (branchesAccess.length > 0) {
      return {
        privateAccess: 'department',
        branchesAccess: branchesAccess.map(({ dsid_branch }) => dsid_branch),
      }
    } else if (usersAccess.length > 0) {
      return {
        privateAccess: 'employee',
        usersAccess: usersAccess.map(({ usersAccess }) => usersAccess),
      }
    } else {
      return { privateAccess: 'organization' }
    }
  }, [other])

  const onUpdate = useCallback(async () => {
    try {
      const { privateAccess } = reverseParseFromBackend
      const { [privateAccess]: func } = parseSettingsFuncMap
      const parseResult = func(other)
      await api.post(URL_CREATE_UPDATE, {
        template: {
          json: filter,
          ...parseResult,
        },
        type,
        id: dsid_template,
      })
      setTabState(setUnFetchedState())
      getNotification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Шаблон обновлен успешно',
      })
      onReverse()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    dsid_template,
    filter,
    getNotification,
    onReverse,
    other,
    reverseParseFromBackend,
    setTabState,
    type,
  ])

  useEffect(loadData, [loadData])

  return (
    <div className="flex-container  w-full p-4 overflow-hidden">
      <div className="flex flex-col h-full w-full overflow-hidden">
        <ScrollBar className="m-4 h-full w-full">
          <Form
            className=" grid grid-row-gap-5 h-min mr-4 h-full"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
        </ScrollBar>
        <div className="flex items-start h-32">
          <SecondaryOverBlueButton
            disabled={dss_json === JSON.stringify(filter)}
            className=" w-64"
            onClick={onUpdate}
          >
            Сохранить шаблон
          </SecondaryOverBlueButton>
          <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
            Отменить
          </SecondaryGreyButton>
        </div>
      </div>
    </div>
  )
}

SearchUpdateTemplateTab.propTypes = {}

export default SearchUpdateTemplateTab
