import React, { useCallback, useContext, useState } from 'react'
import {
  ContHover,
  LeafContainer,
  StyledContextMenu,
  StyledItem,
  ThreeDotButton,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import Icon from '@Components/Components/Icon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import { SetActionContext } from '@/Pages/Information/constans'
import DeleteWindow from '@/Pages/Information/Components/DeleteFolder'
import MimeTypeIconComponent from '@/Pages/Information/Components/RowComponents.js/MimeTypeIconComponent'
import PreviewContentWindow from '@/Components/PreviewContentWindow'
import { InformationWindowWrapper } from '@/Components/PreviewContentWindow/Decorators'

const ContentWindow = InformationWindowWrapper(PreviewContentWindow)
const DocumentComponent = ({
  name,
  id,
  mimeType,
  contentId,
  level,
  permit,
}) => {
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const { setActionComponent } = useContext(SetActionContext)

  const onDelete = useCallback(
    () =>
      setActionComponent({
        Component: (props) => <DeleteWindow {...props} id={id} />,
      }),
    [id, setActionComponent],
  )

  const onPreviewComponent = useCallback(
    () =>
      setActionComponent({
        Component: (props) => (
          <ContentWindow
            {...props}
            id={contentId}
            namwe={contentId}
            mimeType={mimeType}
          />
        ),
      }),
    [contentId, mimeType, setActionComponent],
  )

  return (
    <LeafContainer
      key={id}
      subRow={level}
      className={'flex flex-col w-full border-b-2'}
    >
      <button
        type="button"
        className="flex items-center w-full h-full min-h-12 py-2"
        onDoubleClick={onPreviewComponent}
      >
        <div className="flex items-center">
          <MimeTypeIconComponent mimeType={mimeType} />
          <span className="ml-2">{name}</span>
          {permit && (
            <ContHover>
              <ThreeDotButton>
                <Icon
                  icon={ThreeDotIcon}
                  size={14}
                  className="color-white cursor-pointer "
                  onClick={openContextMenu}
                />
              </ThreeDotButton>
            </ContHover>
          )}
          {open && (
            <ContextMenu width={130} target={target} onClose={closeContextMenu}>
              <StyledContextMenu className="bg-white rounded w-full px-4 pt-4 ">
                <StyledItem className="mb-3 font-size-12" onClick={onDelete}>
                  Удалить
                </StyledItem>
              </StyledContextMenu>
            </ContextMenu>
          )}
        </div>
      </button>
    </LeafContainer>
  )
}

export default DocumentComponent
