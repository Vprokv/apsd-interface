import React, { useCallback, useState } from 'react'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import {
  ContHover,
  LeafContainer,
  StyledItem,
  ThreeDotButton,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import { StyledContextMenu } from '@/Components/Tips/styles'

const FolderWithChildrenComponent = ({
  renderEntities,
  toggleDisplayedFlag,
  isDisplayed,
  childs,
  name,
  id,
  edit,
  level,
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

  return (
    <LeafContainer
      key={id}
      subRow={level}
      className={`flex flex-col w-full ${isDisplayed ? '' : 'mb-4'}`}
    >
      <button
        type="button"
        className="flex items-start w-full"
        onClick={toggleDisplayedFlag}
      >
        <Icon
          icon={angleIcon}
          size={10}
          className={`color-text-secondary mr-1 ${
            isDisplayed ? '' : 'rotate-180'
          }`}
        />
        <span>{name}</span>
        {edit && (
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
              <StyledItem className="mb-3 font-size-12" onClick={() => null}>
                Добавить папку
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={() => null}>
                Добавить файл
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={() => null}>
                Редактировать
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={() => null}>
                Удалить
              </StyledItem>
            </StyledContextMenu>
          </ContextMenu>
        )}
      </button>
      {isDisplayed && (
        <div className="flex flex-col mt-4 pl-4">
          {childs.map(renderEntities())}
        </div>
      )}
    </LeafContainer>
  )
}

export default FolderWithChildrenComponent
