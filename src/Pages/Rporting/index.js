import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, REPORTING, TokenContext } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_REPORTS_BUILD, URL_REPORTS_GET, URL_REPORTS_ITEM } from '@/ApiList'
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

const Reporting = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const tabItemState = useTabItem({ stateId: REPORTING })
  const [filter, setFilter] = useState({})
  const { token } = useContext(TokenContext)
  const getNotification = useOpenNotification()

  const {
    tabState: {
      data: { name, parameters = [], id: reportId, dss_def_format } = {},
    },
  } = tabItemState

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
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, id])

  useSetTabName(useCallback(() => name, [name]))
  useAutoReload(loadData, tabItemState)

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
        // data: response,
        data: { fileKey, message, email },
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

        downloadFileWithReload(data, `${name}.${dss_def_format}`)
      }
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, dss_def_format, filter, getNotification, name, reportId, token])

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
                  onClick={validationProps.onSubmit}
                >
                  Сформировать
                </LoadableSecondaryOverBlueButton>
              </div>
            </>
          )}
        </Validation>
      </ScrollBar>
    </>
  )
}

Reporting.propTypes = {}

export default Reporting
