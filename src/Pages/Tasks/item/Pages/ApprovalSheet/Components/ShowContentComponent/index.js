import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import anyTypeIcon from '@/Icons/DocumentType/anyTypeIcon.svg'
import { ButtonForIcon } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/CustomIconComponent'
import PreviewContentWindow from '@/Components/PreviewContentWindow'
import { ApprovalSheetWindowWrapper } from '@/Components/PreviewContentWindow/Decorators'
import ModalWindowWrapper from '@/Components/ModalWindow'
import ScrollBar from '@Components/Components/ScrollBar'
import styled from 'styled-components'

const ContentWindow = ApprovalSheetWindowWrapper(PreviewContentWindow)

const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  max-width: 500px;
  width: 30%;
  margin: auto;
`

const ShowContentComponent = ({ contents }) => {
  const [contentListWindow, setContentListWindow] = useState(false)
  const [contentWindowOpen, setContentWindowOpen] = useState(false)
  const [selectState, setSelectedState] = useState({})

  const changeModalState = useCallback(
    (setOpenState) => (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const openContent = useCallback(
    (val) => () => {
      setSelectedState(val?.id)
      changeModalState(setContentWindowOpen)(true)()
    },
    [changeModalState, setContentWindowOpen],
  )

  const onCloseShowContent = useCallback(() => {
    changeModalState(setContentWindowOpen)(false)()
    setSelectedState({})
  }, [changeModalState, setContentWindowOpen])

  const renderedEntities = useMemo(
    () =>
      contents?.map((val) => (
        <button
          key={val?.id}
          type="button"
          className="flex items-center w-full h-10 border-b"
          onClick={openContent(val)}
        >
          <span className="mr-auto ml-2">{val?.dssContentName}</span>
        </button>
      )),
    [contents, openContent],
  )

  return (
    <>
      {contents?.length && (
        <ButtonForIcon
          onClick={
            contents?.length > 1
              ? () => setContentListWindow(true)
              : openContent(contents[0])
          }
        >
          {<img src={anyTypeIcon} alt="" className=" w-4 h-4" />}
        </ButtonForIcon>
      )}
      <StandardSizeModalWindow
        title="Выберите контент"
        open={contentListWindow}
        onClose={changeModalState(setContentListWindow)(false)}
      >
        <ScrollBar className="pr-6 font-size-14">{renderedEntities}</ScrollBar>
      </StandardSizeModalWindow>
      <ContentWindow
        open={contentWindowOpen}
        onClose={onCloseShowContent}
        value={selectState}
      />
    </>
  )
}

ShowContentComponent.propTypes = {
  contents: PropTypes.array.isRequired,
}

export default ShowContentComponent
