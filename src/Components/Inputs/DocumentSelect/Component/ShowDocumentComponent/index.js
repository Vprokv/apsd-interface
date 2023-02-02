import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import DocumentShowIcon from '@/Icons/DocumentShowIcon'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import TitleCard from '@/Components/Inputs/DocumentSelect/Component/ShowDocumentComponent/Components/TitleCard'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, WINDOW_SHOW_TITLE } from '@/contants'
import { URL_DOCUMENT_ITEM } from '@/ApiList'
import {useNavigate} from "react-router-dom";
import {TabStateManipulation} from "@Components/Logic/Tab";

const Message = styled.div`
  margin-top: 4px;
  font-size: 12px;
  background-color: black;
  color: white;
  position: absolute;
  font-weight: 500;
  padding: 5px;
  white-space: nowrap;
  z-index: 10;
  border-radius: 5px;
`

const ContHover = styled.div`
  display: flex;
  height: 100%;
  opacity: 0;
`

const LeafContainer = styled.div`
  &:hover {
    ${ContHover} {
      opacity: 1;
    }
  }
`

export const ShowDocumentWindow = styled(ModalWindow)`
  width: 81.25%;
  height: 87.21%;
  margin: auto;
`

export const ShowDocumentButton = styled.button.attrs({ type: 'button' })`
  background-color: var(--light-blue);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: var(--form--elements_height);
  width: var(--form--elements_height);
  min-width: var(--form--elements_height);

  &:disabled {
    background: var(--text-secondary);
    color: var(--form-elements-border-color);
  }
`

const ShowDocumentComponent = ({ className, selectedState }) => {
  const [open, setOpen] = useState(false)
  const api = useContext(ApiContext)
  const navigate = useNavigate()
  const { openNewTab } = useContext(TabStateManipulation)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )

  const tabItemState = useTabItem({
    stateId: WINDOW_SHOW_TITLE,
  })

  const { setTabState } = tabItemState

  const handleClick = useCallback(
    () =>
      openNewTab(
        navigate(`/document/${selectedState}/ddt_startup_complex_type_doc`),
      ),
    [navigate, openNewTab, selectedState],
  )

  const getDocumentData = useCallback(async () => {
    const { data } = await api.post(URL_DOCUMENT_ITEM, {
      id: selectedState,
      type: 'ddt_startup_complex_type_doc',
    })
    setTabState({ data })
  }, [api, selectedState, setTabState])

  const onOpen = useCallback(async () => {
    await getDocumentData()
    changeModalState(true)()
  }, [changeModalState, getDocumentData])

  return (
    <LeafContainer>
      <div className={`${className}`}>
        <ShowDocumentButton disabled={!selectedState} onClick={handleClick}>
          <Icon icon={DocumentShowIcon} />
        </ShowDocumentButton>
        <ContHover>
          <Message>Перейти в документ</Message>
        </ContHover>
      </div>
      {/*<ShowDocumentWindow open={open} onClose={changeModalState(false)}>*/}
      {/*  <TitleCard documentId={selectedState} documentState={tabItemState} />*/}
      {/*</ShowDocumentWindow>*/}
    </LeafContainer>
  )
}

ShowDocumentComponent.propTypes = {}

export default ShowDocumentComponent