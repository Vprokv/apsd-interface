import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, REPORTING, TokenContext } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_REPORTS_BUILD, URL_REPORTS_GET, URL_REPORTS_ITEM } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ReportsForm } from '@/Pages/Rporting/styled'
import { propsTransmission } from '@/Pages/Rporting/rules'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import { LoadableSecondaryOverBlueButton } from '@/Components/Button'
import NoFieldType from '@/Components/NoFieldType'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { Validation } from '@Components/Logic/Validator'

export const UserContext = createContext({})

const Reporting = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const tabItemState = useTabItem({ stateId: REPORTING })
  const [filter, setFilter] = useState({})
  const { token } = useContext(TokenContext)
  const user = useRecoilValue(userAtom)
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
      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, id])

  useSetTabName(useCallback(() => name, [name]))
  useAutoReload(loadData, tabItemState)

  const { fields, rules } = useMemo(
    () =>
      parameters.reduce(
        (acc, attr) => {
          const { label, name, type, required } = attr
          const { [type]: transmission = () => ({ component: NoFieldType }) } =
            propsTransmission

          if (required) {
            acc.rules[name] = [{ name: VALIDATION_RULE_REQUIRED }]
          }

          acc.fields.push({
            label,
            id: name,
            ...transmission({
              api,
              backConfig: attr,
              nextProps: {},
              type,
              user,
            }),
          })

          return acc
        },
        { rules: {}, fields: [] },
      ),
    [api, parameters, user],
  )

  const onBuild = useCallback(async () => {
    try {
      const {
        data: { fileKey },
      } = await api.post(URL_REPORTS_BUILD, {
        id: reportId,
        reportParameters: {
          ...filter,
          format: dss_def_format,
        },
      })

      const { data } = await api.get(`${URL_REPORTS_GET}${fileKey}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, `${name}.${dss_def_format}`)
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
          fields={fields}
          value={filter}
          onInput={setFilter}
          rules={rules}
          onSubmit={onBuild}
          inputWrapper={DefaultWrapper}
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
