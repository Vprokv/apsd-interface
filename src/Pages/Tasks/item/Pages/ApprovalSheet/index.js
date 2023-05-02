import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_APPROVAL_SHEET, URL_BUSINESS_PERMIT } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import LoadableSelect from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon } from '@/Components/Button'
import OtherIcon from './Components/icons/Other'
import PostponeIcon from './Components/icons/Postpone'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import {
  LoadContext,
  PermitDisableContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
import angleIcon from '@/Icons/angleIcon'
import { DocumentIdContext, DocumentTypeContext } from '../../constants'
import { DefaultChildIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Icons/DefaultChildIcon'
import ApplyTemplateWindow from './Components/ApplyTemplateWindow'
import CreateTemplateWindow from './Components/CreateTemplateWindow'
import LeafComponent from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/LeafComponent'
import EditIcon from '@/Icons/editIcon'
import Tips from '@/Components/Tips'
import PropTypes from 'prop-types'

const DotIcon = ({ className, onClick }) => (
  <Icon
    icon={DefaultChildIcon}
    onClick={onClick}
    size={4}
    className={className}
  />
)

DotIcon.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

const ApprovalSheet = () => {
  const { type } = useParams()
  const api = useContext(ApiContext)
  const [filterValue, setFilterValue] = useState({})
  const [permit, setPermit] = useState(false)
  const [toggleNavigationData, setToggleNavigationData] = useState({})
  const documentId = useContext(DocumentIdContext)
  const documentType = useContext(DocumentTypeContext)
  const [state, setState] = useState(false)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    setTabState,
    tabState: { data = [] },
  } = tabItemState

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_APPROVAL_SHEET, {
      id: documentId,
      type,
    })
    return data
  }, [api, documentId, type])

  useEffect(() => {
    setToggleNavigationData(
      data.reduce((acc, { type }) => {
        return {
          ...acc,
          [type]: true,
        }
      }, {}),
    )
  }, [data])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_BUSINESS_PERMIT, {
        documentType: type,
        documentId,
      })
      setPermit(data)
    })()
  }, [api, documentId, documentType, type])

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: LoadableSelect,
        placeholder: 'Ждать первой визы',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'query',
        component: SearchInput,
        placeholder: 'Период доработки',
      },
    ],
    [],
  )

  const handleInput = useCallback((v) => {
    console.log(v)
  }, [])

  const openAllStages = useCallback(() => {
    for (let key in toggleNavigationData) {
      setToggleNavigationData(({ [key]: prevAmount, ...prevState }) => ({
        ...prevState,
        [key]: !prevAmount,
      }))
    }
    setState((state) => !state)
  }, [toggleNavigationData])

  const toggleStage = useCallback((v) => {
    setToggleNavigationData(({ [v]: prevAmount, ...prevState }) => {
      return { ...prevState, [v]: !prevAmount }
    })
  }, [])

  return (
    <PermitDisableContext.Provider value={!permit}>
      <LoadContext.Provider value={setChange}>
        <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
          <div className="flex items-center py-4 form-element-sizes-32">
            <FilterForm
              className="mr-2"
              value={filterValue}
              onInput={setFilterValue}
              fields={fields}
              inputWrapper={EmptyInputWrapper}
            />
            <div className="flex items-center ml-auto">
              <CreateTemplateWindow jsonData={data} />
              <ApplyTemplateWindow />
              <ButtonForIcon
                disabled={!permit}
                className="mx-2 color-text-secondary"
              >
                <Icon icon={PostponeIcon} />
              </ButtonForIcon>
              <Tips text={!state ? 'Свернуть все' : 'Развернуть все'}>
                <ButtonForIcon
                  className="color-text-secondary"
                  onClick={openAllStages}
                >
                  <Icon icon={OtherIcon} />
                </ButtonForIcon>
              </Tips>
            </div>
          </div>
          <ScrollBar>
            {data.map(({ stages, type, name, canAdd }, key) => (
              <div className="flex flex-col" key={type}>
                <LevelStage onClick={() => toggleStage(type)}>
                  {!!stages?.length && (
                    <button
                      className="pl-2"
                      type="button"
                      onClick={() => toggleStage(type)}
                    >
                      <Icon
                        icon={angleIcon}
                        size={10}
                        className={`color-text-secondary ${
                          toggleNavigationData[type] ? '' : 'rotate-180'
                        }`}
                      />
                    </button>
                  )}
                  <div
                    className={`${
                      !stages?.length ? 'ml-6' : 'ml-2'
                    } my-4 flex bold`}
                  >
                    {name}
                  </div>
                  {canAdd && (
                    <CreateApprovalSheetWindow
                      loadData={setChange}
                      stageType={type}
                    />
                  )}
                </LevelStage>
                {toggleNavigationData[type] && (
                  <Tree
                    childrenLessIcon={DotIcon}
                    DefaultChildrenIcon={DotIcon}
                    key={key}
                    defaultExpandAll={true}
                    valueKey="id"
                    options={stages}
                    rowComponent={RowSelector}
                    onUpdateOptions={() => null}
                    childrenKey="approvers"
                    onInput={handleInput}
                    LeafComponent={LeafComponent}
                  />
                )}
              </div>
            ))}
          </ScrollBar>
        </div>
      </LoadContext.Provider>
    </PermitDisableContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
