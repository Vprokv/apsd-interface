import { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_ADDITIONAL_AGREEMENT_STAGE_MOVE,
  URL_APPROVAL_SHEET,
  URL_BUSINESS_PERMIT,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Icon from '@Components/Components/Icon'
import Button, { ButtonForIcon } from '@/Components/Button'
import OtherIcon from './Components/icons/Other'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import CreateApprovalSheetWindow, {
  CustomSizeModalWindow,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
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
import useReadDataState from '@Components/Logic/Tab/useReadDataState'
import { LevelStageWrapper } from './styles'
import CheckBox from '@/Components/Inputs/CheckBox'

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
  const [typeForCreateApprovalSheetWindow, setType] = useState('')
  const api = useContext(ApiContext)
  const [permit, setPermit] = useState(false)
  const [toggleNavigationData, setToggleNavigationData] = useState({})
  const documentId = useContext(DocumentIdContext)
  const documentType = useContext(DocumentTypeContext)
  const [state, setState] = useState(false)
  const [allIteration, setAllIteration] = useState(false)
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

  const [{ selectedState, ...tabState }, setTabState] = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_APPROVAL_SHEET, {
        id: documentId,
        allIteration,
        type,
      })

      return data
      // return responseData
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [allIteration, api, documentId, getNotification, type])

  const [{ data = [], loading, reloadData, shouldReloadData }, updateData] =
    useAutoReload(loadData, tabState, setTabState)

  const [{ data: pageData }] = useReadDataState(tabState, setTabState)

  useEffect(() => {
    // заставляем перезагрузить данные на первом рендере, в случаее если ранее данные для этой вкладки
    // были загруженны и теперь мы на нее повторно вернулись
    // при этом пользуемся стандартным функционалам загрузки по триггерам
    if (!shouldReloadData) {
      reloadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleInput = useCallback(
    (selectedState) => {
      setTabState({ selectedState })
    },
    [setTabState],
  )

  const setTypeForCreateApprovalSheetWindow = useCallback(
    (type) => () => {
      setType(type)
    },
    [],
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

  const onUpdateStageOption = useCallback(
    (key, childrenIndex) => (nextLeafValue) =>
      updateData((prev) => {
        const nextVal = [...prev]
        // eslint-disable-next-line no-unused-vars
        const { [childrenIndex]: oldVal, ...props } = nextVal[key]

        nextVal[key] = { ...props, [childrenIndex]: nextLeafValue }
        return nextVal
      }),
    [updateData],
  )

  const onDragRule = useCallback(
    (canAdd) =>
      ({ status }, level) => {
        return canAdd && level === 0 && status === 'new'
      },
    [],
  )

  const onDragSettingsSave = useCallback(
    (stageName) => async (listPhases) => {
      try {
        const { status } = await api.post(URL_ADDITIONAL_AGREEMENT_STAGE_MOVE, {
          docType: type,
          documentId,
          stageName,
          listPhases,
        })
        getNotification(defaultFunctionsMap[status]())
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
        return new Error(e)
      }
    },
    [api, documentId, getNotification, type],
  )

  return (
    <PermitDisableContext.Provider value={!permit}>
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <CheckBox
            text={'Все итерации'}
            value={allIteration}
            onInput={() => setAllIteration((v) => !v)}
          />
          <div className="flex items-center ml-auto">
            {/*<CreateTemplateWindow jsonData={data} />*/}
            {/*<ApplyTemplateWindow />*/}
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
            {data.map((props, key) => {
              const { stages, type, name, canAdd } = props
              return (
                <div className="flex flex-col" key={type}>
                  <LevelStageWrapper>
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
                            onClick={() => toggleStage(type)}
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
                    </LevelStage>
                    {canAdd && (
                      <div className="flex items-center ml-auto ">
                        <Button
                          disabled={!permit}
                          onClick={setTypeForCreateApprovalSheetWindow(type)}
                          className={`${
                            !permit ? 'color-text-secondary' : 'color-blue-1'
                          }`}
                        >
                          Добавить этап
                        </Button>
                      </div>
                    )}
                  </LevelStageWrapper>
                  {toggleNavigationData[type] && (
                    <Tree
                      parent={stages}
                      childrenLessIcon={DotIcon}
                      DefaultChildrenIcon={DotIcon}
                      key={key}
                      defaultExpandAll={true}
                      valueKey="id"
                      value={selectedState}
                      options={stages}
                      rowComponent={RowSelector}
                      onUpdateOptions={onUpdateStageOption(key, 'stages')}
                      childrenKey={getChildrenKey}
                      onInput={handleInput}
                      LeafComponent={LeafComponent}
                      draggable={onDragRule(canAdd)}
                      dropEvent={onDragSettingsSave(type)}
                    />
                  )}
                </div>
              )
            })}
          </ScrollBar>
        )}
        <CustomSizeModalWindow
          title="Добавить этап"
          open={typeForCreateApprovalSheetWindow}
          onClose={setTypeForCreateApprovalSheetWindow('')}
        >
          <CreateApprovalSheetWindow
            stageType={typeForCreateApprovalSheetWindow}
            onClose={setTypeForCreateApprovalSheetWindow('')}
          />
        </CustomSizeModalWindow>
      </div>
    </PermitDisableContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
