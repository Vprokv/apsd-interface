import React, { useCallback, useContext, useState } from 'react'
import ScrollBar from '@Components/Components/ScrollBar'
import {
  OnSetRemarkActionContext,
  SetAnswerStateContext,
  ToggleContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import IterationComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/Iteration'
import { useOpenNotification } from '@/Components/Notificator'
import ToggleNavigationItemWrapper, {
  WithToggleNavigationItem,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/WithToggleNavigationItem'
import CreateAnswer from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer'
import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {
  URL_REMARK_EDIT_SET_REMARK,
  URL_REMARK_LIST,
  URL_TASK_COMPLETE,
} from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import { LoadTasks } from '@/Pages/Main/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import AboutRemarkWindow from '@/Pages/Tasks/item/Components/AboutRemarkWindow'
import {
  CurrentTabContext,
  setUnFetchedState,
  TabStateManipulation,
} from '@Components/Logic/Tab'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 70%;
  max-height: 70%;
  margin: auto;
`

const WithToggle = ToggleNavigationItemWrapper(WithToggleNavigationItem)

const ViewAdditionsRemarks = ({
  open,
  onClose,
  stages,
  taskId,
  reloadData,
  setComponent,
  documentId,
}) => {
  const [remarksStages, setStages] = useState(stages)
  const api = useContext(ApiContext)
  const [toggle, onToggle] = useState({})
  const getNotification = useOpenNotification()
  const [selected, setSelected] = useState()
  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: taskId,
        signal: 'finish_simple_approve',
      })
      closeCurrenTab()
      getNotification(defaultFunctionsMap[status]())
      reloadData()
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
      reloadSidebarTaskCounters()
    } catch (e) {
      const { response: { status, data } = {} } = e
      if (status === 412 && data === 'finish_without_remarks') {
        onClose()
        return setComponent({
          Component: (props) => (
            <AboutRemarkWindow signal={'finish_without_remark'} {...props} />
          ),
        })
      }
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    onClose,
    reloadData,
    reloadSidebarTaskCounters,
    setComponent,
    taskId,
    updateTabStateUpdaterByName,
  ])

  const onSetRemark = useCallback(
    ({ remarkIds, vault }) =>
      async () => {
        try {
          const { status } = await api.post(URL_REMARK_EDIT_SET_REMARK, {
            remarkIds,
            vault,
          })
          getNotification(defaultFunctionsMap[status]())

          const { data: { stages = [] } = {} } = await api.post(
            URL_REMARK_LIST,
            {
              documentId,
              filter: {
                allStages: false,
                allIteration: false,
                isApprove: true,
              },
              sort: [
                {
                  direction: 'ASC',
                  property: 'remarkCreationDate',
                },
              ],
            },
          )
          setStages(stages)
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      },
    [api, documentId, getNotification],
  )

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title={'Ознакомьтесь с замечаниями'}
    >
      <div className="flex flex-col overflow-hidden h-full w-full">
        <ScrollBar className="w-full">
          <SetAnswerStateContext.Provider value={setSelected}>
            <div className="flex flex-col h-full">
              <OnSetRemarkActionContext.Provider value={onSetRemark}>
                <ToggleContext.Provider value={{ toggle, onToggle }}>
                  {remarksStages.map((val) => (
                    <WithToggle key={val.stageName} id={val.stageName}>
                      {({ isDisplayed, toggleDisplayedFlag }) => {
                        return (
                          <IterationComponent
                            isDisplayed={isDisplayed}
                            toggleDisplayedFlag={toggleDisplayedFlag}
                            {...val}
                          />
                        )
                      }}
                    </WithToggle>
                  ))}
                </ToggleContext.Provider>
              </OnSetRemarkActionContext.Provider>
            </div>
          </SetAnswerStateContext.Provider>
        </ScrollBar>
        <div className="flex w-full items-center justify-end">
          <UnderButtons
            leftLabel="Закрыть"
            rightLabel="Завершить"
            rightFunc={onSave}
            leftFunc={onClose}
          />
        </div>
      </div>

      <CreateAnswer {...selected} setSelected={setSelected} />
    </StandardSizeModalWindow>
  )
}

export default ViewAdditionsRemarks
