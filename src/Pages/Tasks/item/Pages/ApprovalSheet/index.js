import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_APPROVAL_SHEET, URL_BUSINESS_PERMIT } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon } from '@/Components/Button'
import OtherIcon from './Components/icons/Other'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
import angleIcon from '@/Icons/angleIcon'
import { DocumentIdContext, DocumentTypeContext } from '../../constants'
import { DefaultChildIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Icons/DefaultChildIcon'
import ApplyTemplateWindow from './Components/ApplyTemplateWindow'
import CreateTemplateWindow from './Components/CreateTemplateWindow'
import LeafComponent from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/LeafComponent'
import Tips from '@/Components/Tips'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import PropTypes from 'prop-types'
import Loading from '../../../../../Components/Loading'

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

const childrenKeyMap = {
  0: 'approvers',
  1: 'additionalStage',
}

const ApprovalSheet = () => {
  const { type } = useParams()
  const api = useContext(ApiContext)
  const [permit, setPermit] = useState(false)
  const [toggleNavigationData, setToggleNavigationData] = useState({})
  const documentId = useContext(DocumentIdContext)
  const documentType = useContext(DocumentTypeContext)
  const [state, setState] = useState(false)
  const getNotification = useOpenNotification()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.post(URL_BUSINESS_PERMIT, {
          documentType: type,
          documentId,
        })
        setPermit(data)
      } catch (e) {
        const { response: { status } = {} } = e
        getNotification(defaultFunctionsMap[status]())
      }
    })()
  }, [api, documentId, documentType, getNotification, type])

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState: { data = [], loading, selectedState },
    shouldReloadDataFlag,
    setTabState,
  } = tabItemState

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_APPROVAL_SHEET, {
        id: documentId,
        type,
      })

      return data
      // return responseData
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, documentId, getNotification, permit, type])

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

  const fetchDataFunction = useAutoReload(loadData, tabItemState)

  useEffect(() => {
    // заставляем перезагрузить данные на первом рендере, в случаее если ранее данные для этой вкладки
    // были загруженны и теперь мы на нее повторно вернулись
    // при этом пользуемся стандартным функционалам загрузки по триггерам
    if (!shouldReloadDataFlag) {
      fetchDataFunction()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInput = useCallback(
    (selectedState) => {
      setTabState({ selectedState })
    },
    [setTabState],
  )

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

  const getChildrenKey = useCallback((level) => {
    const { [level]: key } = childrenKeyMap
    return key
  }, [])

  return (
    <PermitDisableContext.Provider value={!permit}>
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <div className="flex items-center ml-auto">
            <CreateTemplateWindow jsonData={data} />
            <ApplyTemplateWindow />
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
        {loading ? (
          <Loading />
        ) : (
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
                  {canAdd && <CreateApprovalSheetWindow stageType={type} />}
                </LevelStage>
                {toggleNavigationData[type] && (
                  <Tree
                    childrenLessIcon={DotIcon}
                    DefaultChildrenIcon={DotIcon}
                    key={key}
                    defaultExpandAll={true}
                    valueKey="id"
                    value={selectedState}
                    options={stages}
                    rowComponent={RowSelector}
                    onUpdateOptions={() => null}
                    childrenKey={getChildrenKey}
                    onInput={handleInput}
                    LeafComponent={LeafComponent}
                  />
                )}
              </div>
            ))}
          </ScrollBar>
        )}
      </div>
    </PermitDisableContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
