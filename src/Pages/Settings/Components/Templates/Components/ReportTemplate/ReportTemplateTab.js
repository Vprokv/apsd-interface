import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, REPORTING_STATE } from '@/contants'
import { useAutoReload, useTabItem } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import {
  URL_CREATE_TEMPLATE,
  URL_REPORTS_ITEM,
  URL_REPORTS_LIST,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import ScrollBar from '@Components/Components/ScrollBar'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import useParseConfig from '@/Utils/Parser'
import attrubutesAdapter from '@/Pages/Rporting/Parser/attrubutesAdapter'
import reportParserStages from '@/Pages/Rporting/Parser'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/Forms/ValidationStateUi/RowInputWrapper'
import { useNavigate, useParams } from 'react-router-dom'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'

const defaultFilter = {}

const ReportTemplateTab = () => {
  const api = useContext(ApiContext)
  const [{ filter = defaultFilter, ...tabState }, setTabState] = useTabItem({
    stateId: REPORTING_STATE,
  })
  const [filterField, setFilterField] = useState({})
  const getNotification = useOpenNotification()
  const navigate = useNavigate()
  const { onInput } = useContext(TemplateTabStateContext)
  const [open, setOpenState] = useState(false)
  const { ['*']: type } = useParams()
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

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
        return data
      }
    } catch (e) {
      const { response: { status = 500 } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter.reportId, getNotification])

  const [{ data: { parameters = [] } = {} }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const { fields: parsedFields, ...other } = useParseConfig({
    value: filterField,
    fieldsDesign: useMemo(
      () => parameters.map(attrubutesAdapter),
      [parameters],
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

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

  return (
    <div className="flex flex-col w-full p-4 overflow-hidden">
      <ScrollBar className="m-4">
        <div className=" w-full">
          <Form
            className=" w-full grid  gap-5 h-min mr-4 grid-cols-2"
            value={filter}
            onInput={useCallback(
              (filter) => setTabState({ filter }),
              [setTabState],
            )}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
        </div>
      </ScrollBar>
      <div className="flex items-start h-32">
        <SecondaryOverBlueButton
          disabled={Object.keys(filter).length < 2}
          className=" w-64"
          onClick={changeModalState(true)}
        >
          Сохранить шаблон
        </SecondaryOverBlueButton>
        <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
          Отменить
        </SecondaryGreyButton>
      </div>
      <CreateWindow
        open={open}
        onReverse={onReverse}
        changeModalState={changeModalState}
        value={filter}
        type={type}
        createFunc={useCallback(
          (api) =>
            (parseResult) =>
            (type) =>
            async ({ reportId, ...json }) => {
              return await api.post(URL_CREATE_TEMPLATE, {
                template: {
                  ...parseResult,
                  json: [{ reportId, ...json }],
                  reportId,
                },
                type,
              })
            },
          [],
        )}
      />
    </div>
  )
}

ReportTemplateTab.propTypes = {}

export default ReportTemplateTab
