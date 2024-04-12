import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, REPORTING_STATE } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { useNavigate } from 'react-router-dom'
import {
  parseSettingsFuncMap,
  TemplateTabStateContext,
} from '@/Pages/Settings/Components/Templates/constans'
import {
  URL_CREATE_UPDATE,
  URL_REPORTS_ITEM,
  URL_REPORTS_LIST,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useParseConfig from '@/Utils/Parser'
import attrubutesAdapter from '@/Pages/Rporting/Parser/attrubutesAdapter'
import reportParserStages from '@/Pages/Rporting/Parser'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import ScrollBar from '@Components/Components/ScrollBar'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/Forms/ValidationStateUi/RowInputWrapper'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const ReportUpdateTemplateTab = ({
  dss_name,
  dss_note,
  dss_json,
  dsid_template,
  type,
  ...other
}) => {
  const api = useContext(ApiContext)
  const { 1: setTabState } = useTabItem({ stateId: REPORTING_STATE })
  const [initialFilter] = JSON.parse(dss_json)
  const [filter, setFilter] = useState(initialFilter)
  const [filterField, setFilterField] = useState({})
  const getNotification = useOpenNotification()
  const navigate = useNavigate()
  const { onInput } = useContext(TemplateTabStateContext)
  const [attributes, setAttributes] = useState([])

  const loadData = useCallback(async () => {
    try {
      if (filter.reportId) {
        const { data } = await api.post(URL_REPORTS_ITEM, {
          id: filter.reportId,
        })
        // todo убрать харды , надо для отоброжения, ког
        if (data.parameters.some(({ name }) => name === 'only_original')) {
          setFilterField({ only_original: true })
        }
        setAttributes(data.parameters)
      }
    } catch (e) {
      const { response: { status = 500 } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter.reportId, getNotification])

  useEffect(loadData, [loadData])

  const { fields: parsedFields } = useParseConfig({
    value: filterField,
    fieldsDesign: useMemo(
      () => attributes?.map(attrubutesAdapter),
      [attributes],
    ),
    stages: reportParserStages,
  })

  const fields = useMemo(
    () => [
      {
        id: 'reportId',
        component: AutoLoadableSelect,
        placeholder: 'Выберите отчет',
        label: 'Выберите отчет',
        valueKey: 'id',
        labelKey: 'name',
        loadFunction: async () => {
          const { data } = await api.post(URL_REPORTS_LIST)
          return data
        },
        className: 'col-span-2',
      },
      ...parsedFields,
    ],
    [api, parsedFields],
  )

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

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

  const onUpdate = useCallback(async () => {
    try {
      const { privateAccess } = reverseParseFromBackend
      const { [privateAccess]: func } = parseSettingsFuncMap
      const parseResult = func(other)
      await api.post(URL_CREATE_UPDATE, {
        template: {
          // dssName: dss_name,
          // dssNote: dss_note,
          json: [filter],
          reportId: filter.reportId,
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

  return (
    <div className="flex flex-col w-full p-4 overflow-hidden">
      <ScrollBar className="m-4">
        <div className=" w-full">
          <Form
            className=" w-full grid  gap-5 h-min mr-4 grid-cols-2"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
        </div>
      </ScrollBar>
      <div className="flex items-start h-32">
        <SecondaryOverBlueButton
          disabled={JSON.stringify(initialFilter) === JSON.stringify(filter)}
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
  )
}

ReportUpdateTemplateTab.propTypes = {}

export default ReportUpdateTemplateTab
