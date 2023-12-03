import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, REPORTING, TokenContext } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_CREATE_TEMPLATE,
  URL_REPORTS_BUILD,
  URL_REPORTS_GET,
  URL_REPORTS_ITEM,
  URL_TEMPLATE_LIST,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ReportsForm } from '@/Pages/Rporting/styled'
import ScrollBar from '@Components/Components/ScrollBar'
import { LoadableSecondaryOverBlueButton } from '@/Components/Button'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { Validation } from '@Components/Logic/Validator'
import useParseConfig from '@/Utils/Parser'
import reportParserStages from './Parser'
import attrubutesAdapter from './Parser/attrubutesAdapter'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'
import SearchTemplateWindowList from '@/Pages/Search/Pages/DocumentSearch/Components/SearchTemplateWindowList'

const defaultFilter = {}

const Reporting = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [{ filter = defaultFilter, ...tabState }, setTabState] = useTabItem({
    stateId: REPORTING,
  })
  const { token } = useContext(TokenContext)
  const getNotification = useOpenNotification()

  const [openCreateTemplateWindow, setOpenCreateTemplateWindowState] =
    useState(false)
  const [openUseTemplateWindowState, setOpenUseTemplateWindowState] =
    useState(false)
  const changeCreateTemplateWindowState = useCallback(
    (nextState) => () => {
      setOpenCreateTemplateWindowState(nextState)
    },
    [],
  )
  const changeUseTemplateWindowState = useCallback(
    (nextState) => () => {
      setOpenUseTemplateWindowState(nextState)
    },
    [],
  )

  const setFilter = useCallback(
    (filter) => setTabState({ filter }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_REPORTS_ITEM, {
        id,
      })
      // todo убрать харды , надо для отоброжения, ког
      if (data.parameters.some(({ name }) => name === 'only_original')) {
        setFilter({ only_original: true })
      }
      return data
    } catch (e) {
      const { response: { status = 500 } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, id, setFilter, getNotification])

  const [
    { data: { name, parameters = [], id: reportId, dss_def_format } = {} },
  ] = useAutoReload(loadData, tabState, setTabState)

  useSetTabName(useCallback(() => name, [name]))

  const formProps = useParseConfig({
    value: filter,
    fieldsDesign: useMemo(
      () => parameters.map(attrubutesAdapter),
      [parameters],
    ),
    stages: reportParserStages,
  })

  const onBuild = useCallback(async () => {
    try {
      const {
        data: { fileKey, message, email, name: reportName },
      } = await api.post(URL_REPORTS_BUILD, {
        id: reportId,
        reportParameters: {
          ...filter,
          format: dss_def_format,
        },
      })

      if (email) {
        return getNotification({ message, type: NOTIFICATION_TYPE_SUCCESS })
      } else {
        const { data } = await api.get(
          `${URL_REPORTS_GET}${fileKey}:${token}`,
          { responseType: 'blob' },
        )

        downloadFileWithReload(data, `${reportName}.${dss_def_format}`)
      }
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, dss_def_format, filter, getNotification, reportId, token])

  return (
    <>
      <div className="flex items-center p-4">
        <span className="text-2xl font-medium">{name}</span>
      </div>
      <ScrollBar className="m-4">
        <Validation
          value={filter}
          onInput={setFilter}
          onSubmit={onBuild}
          inputWrapper={DefaultWrapper}
          {...formProps}
        >
          {(validationProps) => (
            <>
              <ReportsForm {...validationProps} />
              <div className="flex items-center justify-end my-4 col-span-1 col-span-2">
                <LoadableSecondaryOverBlueButton
                  onClick={changeUseTemplateWindowState(true)}
                >
                  Применить шаблон
                </LoadableSecondaryOverBlueButton>
                <LoadableSecondaryOverBlueButton
                  className="m-2"
                  onClick={changeCreateTemplateWindowState(true)}
                  disabled={Object.keys(filter).length < 2}
                >
                  Сохранить шаблон
                </LoadableSecondaryOverBlueButton>
                <LoadableSecondaryOverBlueButton
                  onClick={validationProps.onSubmit}
                  className="ml-2"
                >
                  Сформировать
                </LoadableSecondaryOverBlueButton>
              </div>
            </>
          )}
        </Validation>
      </ScrollBar>
      <CreateWindow
        open={openCreateTemplateWindow}
        onReverse={changeCreateTemplateWindowState(false)}
        changeModalState={changeCreateTemplateWindowState}
        value={filter}
        type={'ddt_report_template'}
        createFunc={(api) => (parseResult) => (type) => async (json) => {
          return await api.post(URL_CREATE_TEMPLATE, {
            template: {
              ...parseResult,
              json: [{ reportId: id, ...json }],
              reportId: id,
            },
            type,
          })
        }}
      />
      <SearchTemplateWindowList
        open={openUseTemplateWindowState}
        changeModalState={changeUseTemplateWindowState}
        setGlobalFilter={setFilter}
        type={'ddt_report_template'}
        title={'Выберите шаблон отчета'}
        reportId={id}
        searchFunc={(api) => (searchBody) => async (reportId) => {
          return await api.post(URL_TEMPLATE_LIST, { reportId, ...searchBody })
        }}
      />
    </>
  )
}

Reporting.propTypes = {}

export default Reporting
