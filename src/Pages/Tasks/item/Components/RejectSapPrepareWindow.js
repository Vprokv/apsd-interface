import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '../../../../Components/Inputs/UnderButtons'
import { useCallback, useContext } from 'react'
import { ApiContext, TASK_LIST } from '@/contants'
import { URL_TASK_COMPLETE } from '@/ApiList'
import { useParams } from 'react-router-dom'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { LoadTasks } from '@/Pages/Main/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import PropTypes from 'prop-types'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectSapPrepareWindow = ({ open, onClose, signal }) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()
  const getNotification = useOpenNotification()

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )

  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal,
      })
      onClose()
      closeCurrenTab()
      reloadSidebarTaskCounters()
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    id,
    onClose,
    reloadSidebarTaskCounters,
    signal,
    updateTabStateUpdaterByName,
  ])

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title="Рассмотрение заявки будет отклонено. Активные задания кураторов будут отозваны."
    >
      <UnderButtons
        leftLabel="Отклонить"
        rightLabel="Подтвердить"
        rightFunc={complete}
        leftFunc={onClose}
        className="mt-6"
      />
    </StandardSizeModalWindow>
  )
}

RejectSapPrepareWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signal: PropTypes.string.isRequired,
}

export default RejectSapPrepareWindow
