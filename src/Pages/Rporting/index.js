import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, REPORTING, TASK_LIST, TokenContext } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_PREVIEW_DOCUMENT,
  URL_REPORTS_BUILD,
  URL_REPORTS_GET,
  URL_REPORTS_ITEM,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ReportsForm } from '@/Pages/Rporting/styled'
import SearchOperatorSelector from '@/Pages/Search/Pages/Components/SearchOperatorSelector'
import InputWrapper from '@Components/Components/Forms/InputWrapper'
import { getField, getLoadFunction } from '@/Pages/Rporting/rules'

const Reporting = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const tabItemState = useTabItem({ stateId: REPORTING })
  const [filter, setFilter] = useState({})
  const { token } = useContext(TokenContext)

  const {
    tabState,
    tabState: { data: { name, parameters = [], id: reportId } = {} },
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_REPORTS_ITEM, {
      id,
    })
    return data
  }, [api, id])

  console.log(tabState, 'tabState')

  useSetTabName(useCallback(() => name, [name]))
  useAutoReload(loadData, tabItemState)

  const parseFields = useMemo(
    () =>
      parameters.map(
        ({
          label,
          name,
          type,
          dss_component_reference,
          required,
          multiple,
          state,
        }) => {
          const loadData = getLoadFunction(api)({
            dss_component_reference,
          })

          return {
            ...loadData,
            component: SearchOperatorSelector(type)(getField(type)),
            id: name,
            type,
            placeholder: label,
            label,
            multiple,
            required,
          }
        },
      ),
    [api, parameters],
  )

  const onBuild = useCallback(async () => {
    const {
      data: { fileKey },
    } = await api.post(URL_REPORTS_BUILD, {
      id: reportId,
      reportParameters: filter,
    })

    const { data } = await api.get(`${URL_REPORTS_GET}:${fileKey}:${token}`)
  }, [api, filter, reportId, token])

  return (
    <div>
      <div className="flex items-center m-4">
        <span className="text-2xl font-medium">{name}</span>
      </div>
      <ReportsForm
        fields={parseFields}
        value={filter}
        onInput={setFilter}
        inputWrapper={InputWrapper}
        // rules={}
      />
    </div>
  )
}

Reporting.propTypes = {}

export default Reporting
