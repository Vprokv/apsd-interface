import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ContHover,
  StyledContextMenu,
  StyledItem,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import Icon from '@Components/Components/Icon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import { ThreeDotButton } from '@/Pages/Tasks/item/Pages/Remarks/Components/MoreActionComponent'
import { OpenWindowContext } from '@/Pages/Tasks/archiveList/constans'

const MoreActionComponent = ({ ParentValue: { type, id } }) => {
  const { setOpen } = useContext(OpenWindowContext)
  const [show, setShow] = useState(false)
  const [target, setTarget] = useState({})

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setShow(true)
  }, [])

  return (
    <div className="flex items-center w-full justify-center">
      <ContHover opacity={show ? 1 : undefined}>
        <ThreeDotButton
        // loading={loading}
        // disabled={loading}
        >
          <Icon
            icon={ThreeDotIcon}
            size={14}
            className="ml-1 color-white cursor-pointer "
            onClick={openContextMenu}
          />
        </ThreeDotButton>
      </ContHover>
      {show && (
        <ContextMenu width={120} target={target} onClose={() => setShow(false)}>
          <StyledContextMenu className="bg-white rounded w-full px-4 pt-4 ">
            <StyledItem
              onClick={setOpen({
                nextState: true,
                documentState: { type, id },
              })}
              className="mb-3 font-size-12"
            >
              Экспорт
            </StyledItem>
          </StyledContextMenu>
        </ContextMenu>
      )}
    </div>
  )
}

MoreActionComponent.propTypes = {
  ParentValue: PropTypes.object,
}

export default MoreActionComponent
