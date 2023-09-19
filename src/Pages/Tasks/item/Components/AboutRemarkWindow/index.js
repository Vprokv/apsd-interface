import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import styled from 'styled-components'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import Input from '@/Components/Fields/Input'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import { ContainerContext } from '@Components/constants'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 18%;
  min-height: 22.65%;
  margin: auto;
`

const AboutRemarkWindow = ({ open, onClose, signal }) => {
  const api = useContext(ApiContext)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const getNotification = useOpenNotification()
  const navigate = useNavigate()
  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const { id, type } = useParams()

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
      // updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
      //   loading: false,
      //   fetched: false,
      // }) //TODO на случай если потребуется не закрывать окно, а перезагрузить таб
      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
      onClose()
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    id,
    onClose,
    reloadSidebarTaskCounters,
    signal,
  ])

  const onRedirectTo = useCallback(() => {
    onClose()
    navigate(`/task/${id}/${type}/remarks`)
  }, [id, navigate, onClose, type])

  return (
    <StandardSizeModalWindow open={open} onClose={onClose} title="Внимание">
      <div className="flex flex-col overflow-hidden ">
        <div className="mt-4 mb-10">Завершить задание без замечаний?</div>
        <UnderButtons
          className="w-44 ml-auto w-full"
          leftLabel="Нет"
          rightLabel="Да"
          leftFunc={onRedirectTo}
          rightFunc={complete}
        />
      </div>
    </StandardSizeModalWindow>
  )
}

AboutRemarkWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signal: PropTypes.string.isRequired,
}

export default AboutRemarkWindow
