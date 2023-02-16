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
import {
  URL_DOWNLOAD_FILE,
  URL_PREVIEW_DOCUMENT,
  URL_REPORTS_BUILD,
  URL_REPORTS_GET,
  URL_REPORTS_ITEM,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ReportsForm } from '@/Pages/Rporting/styled'
import InputWrapper from '@Components/Components/Forms/InputWrapper'
import { propsTransmission } from '@/Pages/Rporting/rules'
import downloadFile from '@/Utils/DownloadFile'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import {
  SecondaryBlueButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import NoFieldType from '@/Components/NoFieldType'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'

export const UserContext = createContext({})

const Reporting = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const tabItemState = useTabItem({ stateId: REPORTING })
  const [filter, setFilter] = useState({})
  const { token } = useContext(TokenContext)
  const user = useRecoilValue(userAtom)

  const {
    tabState: { data: { name, parameters = [], id: reportId } = {} },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_REPORTS_ITEM, {
      id,
    })
    return data
  }, [api, id])

  useSetTabName(useCallback(() => name, [name]))
  useAutoReload(loadData, tabItemState)

  const parseFields = useMemo(
    () =>
      parameters.map((attr) => {
        const { label, name, type } = attr
        const { [type]: transmission = () => ({ component: NoFieldType }) } =
          propsTransmission

        return {
          label,
          id: name,
          type,
          ...transmission({
            api,
            backConfig: attr,
            nextProps: {},
            type,
            user,
          }),
        }
      }),
    [api, parameters, user],
  )

  const onBuild = useCallback(async () => {
    const {
      data: { fileKey },
    } = await api.post(URL_REPORTS_BUILD, {
      id: reportId,
      reportParameters: {
        branch_performer: filter.branch_name,
        department_performer: filter.branch_name
        // res_author: ''
      },
    })

    const {
      data: { contentId },
    } = await api.get(`${URL_REPORTS_GET}:${fileKey}:${token}`)

    const sdsd = await api.post(
      URL_DOWNLOAD_FILE,
      {
        type: 'ddt_document_content',
        column: 'dsc_content',
        id: contentId,
      },
      { responseType: 'blob' },
    )

    downloadFile(sdsd, 'dsdsds')
  }, [api, filter, reportId, token])

  return (
    <UserContext.Provider value={user}>
      <div className="flex items-center m-4">
        <span className="text-2xl font-medium">{name}</span>
      </div>
      <ScrollBar>
        <div className="flex py-4 flex-col h-full">
          <ReportsForm
            fields={parseFields}
            value={filter}
            onInput={setFilter}
            inputWrapper={InputWrapper}
            // rules={}
          />
        </div>
      </ScrollBar>
      <div className="flex items-center justify-end m-4">
        <SecondaryOverBlueButton onClick={onBuild}>
          Сформировать
        </SecondaryOverBlueButton>
      </div>
    </UserContext.Provider>
  )
}

Reporting.propTypes = {}

export default Reporting
