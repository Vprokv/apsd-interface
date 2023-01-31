import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_DOCUMENT, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_APPROVAL_SHEET, URL_TEMPLATE_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import LoadableSelect from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import OtherIcon from './Components/icons/Other'
import PostponeIcon from './Components/icons/Postpone'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import {
  CanAddContext,
  LoadContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import { DocumentIdContext, DocumentTypeContext } from '../../constants'
import { CircleMinus } from '@Components/Components/Tree/Icons/CircleMinus'
import { DefaultChildIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Icons/DefaultChildIcon'
import ApplyTemplateWindow from './Components/ApplyTemplateWindow'
import CreateTemplateWindow from './Components/CreateTemplateWindow'

const DotIcon = ({ className, onClick }) => (
  <Icon
    icon={DefaultChildIcon}
    onClick={onClick}
    size={4}
    className={className}
  />
)

const ApprovalSheet = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [filterValue, setFilterValue] = useState({})
  const documentId = useContext(DocumentIdContext)
  const documentType = useContext(DocumentTypeContext)

  console.log(1)

  const {
    tabState: { update },
    setTabState: setDocumentTypeState,
  } = useTabItem({
    stateId: documentType,
  })

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change },
  } = tabItemState

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  useEffect(() => {
    if (!update) {
      setDocumentTypeState({ update: false })
    }
  }, [setDocumentTypeState, update])

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_APPROVAL_SHEET, {
      id: documentId,
      type,
    })
    return data
  }, [api, documentId, type, change])

  useEffect(() => {
    ;(async () => {
      if (update) {
        setTabState({ data: await loadData() })
      }
      setDocumentTypeState({ update: false })
    })()
  }, [loadData, setTabState, update])

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

  return (
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
            <ButtonForIcon className="mx-2 color-text-secondary">
              <Icon icon={PostponeIcon} />
            </ButtonForIcon>
            <ButtonForIcon className="color-text-secondary">
              <Icon icon={OtherIcon} />
            </ButtonForIcon>
          </div>
        </div>
        <ScrollBar>
          {data.map(({ stages, type, name, canAdd }, key) => (
            <WithToggleNavigationItem key={type} id={type}>
              {({ isDisplayed, toggleDisplayedFlag }) => (
                <div className="flex flex-col" key={type}>
                  <LevelStage>
                    {!!stages?.length && (
                      <button
                        className="pl-2"
                        type="button"
                        onClick={toggleDisplayedFlag}
                      >
                        <Icon
                          icon={angleIcon}
                          size={10}
                          className={`color-text-secondary ${
                            isDisplayed ? '' : 'rotate-180'
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
                    <CreateApprovalSheetWindow
                      loadData={setChange}
                      stageType={type}
                    />
                  </LevelStage>
                  {isDisplayed && (
                    <CanAddContext.Provider value={canAdd}>
                      <Tree
                        checkAble={true}
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
                      />
                    </CanAddContext.Provider>
                  )}
                </div>
              )}
            </WithToggleNavigationItem>
          ))}
        </ScrollBar>
      </div>
    </LoadContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
