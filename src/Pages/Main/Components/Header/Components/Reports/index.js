import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import { URL_REPORTS_LIST } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import { useNavigate } from 'react-router-dom'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { ContHover, LeafContainer, Message } from '@/Pages/Rporting/styled'

const mockReports = [
  {
    id: '000002fd004ufhhx', //- id отчета
    systemName: 'string', // - системное наименование отчета
    name: 'string', //- русское имя отчета (для отображения)
    description: 'string', // - расширенное имя отчета (не выводим пользователю)
  },
]

const Reports = () => {
  const [open, setOpenState] = useState(false)
  const [reports, setReports] = useState([])
  const [selected, setSelected] = useState([])
  const navigate = useNavigate()
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const api = useContext(ApiContext)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onOpen = useCallback(async () => {
    const { data } = await api.post(URL_REPORTS_LIST)
    setReports(data)
    changeModalState(true)()
  }, [api, changeModalState])

  const onClick = useCallback(
    (id) => {
      openTabOrCreateNewTab(navigate(`/report/${id}`))
      changeModalState(false)()
    },
    [changeModalState, navigate, openTabOrCreateNewTab],
  )

  const renderedEntities = useMemo(
    () =>
      reports.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          className={`flex items-center w-full h-10 border-b-2 ${
            selected === id ? 'bg-light-gray' : ''
          }`}
          onClick={() => onClick(id)}
        >
          <div className="mr-auto ml-2">{name}</div>
        </button>
      )),
    [onClick, reports, selected],
  )

  return (
    <LeafContainer>
      <ContHover>
        <Message>Отчёты</Message>
      </ContHover>
      <ButtonForIcon className="bg-blue-1" onClick={onOpen}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1.5" y="1.5" width="3" height="13" rx="1" fill="white" />
          <rect x="6.5" y="6.5" width="3" height="8" rx="1" fill="white" />
          <rect x="11.5" y="8.5" width="3" height="6" rx="1" fill="white" />
        </svg>
      </ButtonForIcon>
      <StandardSizeModalWindow
        title="Выберите отчет"
        open={open}
        onClose={changeModalState(false)}
      >
        <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
      </StandardSizeModalWindow>
    </LeafContainer>
  )
}

Reports.propTypes = {}

export default Reports
