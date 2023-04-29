import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, REPORTING, TASK_LIST, TokenContext } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_REPORTS_BUILD, URL_REPORTS_GET, URL_REPORTS_ITEM } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ReportsForm } from '@/Pages/Rporting/styled'
import { propsTransmission } from '@/Pages/Rporting/rules'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import { SecondaryOverBlueButton } from '@/Components/Button'
import NoFieldType from '@/Components/NoFieldType'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'

export const UserContext = createContext({})

const Reporting = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const tabItemState = useTabItem({ stateId: REPORTING })
  const [filter, setFilter] = useState({})
  const { token } = useContext(TokenContext)
  const user = useRecoilValue(userAtom)

  const {
    tabState: {
      data: { name, parameters = [], id: reportId, dss_def_format } = {},
    },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_REPORTS_ITEM, {
      id,
    })
    return data
  }, [api, id])

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
  }, [api, dss_def_format, filter, name, reportId, token])

  return (
    <>
      <div className="flex items-center p-4">
        <span className="text-2xl font-medium">{name}</span>
      </div>
      <ScrollBar className="m-4">
        <ReportsForm
          fields={fields}
          value={filter}
          onInput={setFilter}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={onBuild}
        >
          <div className="flex items-center justify-end my-4 col-span-1 col-span-2">
            <SecondaryOverBlueButton type="submit">
              Сформировать
            </SecondaryOverBlueButton>
          </div>
        </ReportsForm>
      </ScrollBar>
    </>
  )
}

Reporting.propTypes = {}

export default Reporting
