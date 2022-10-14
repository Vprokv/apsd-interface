import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { SidebarContainer } from './styles'
import DeleteIcon from './Group 846.svg'
import SaveIcon from './SaveIcon.svg'
import OtherIcon from './OtherIcon.svg'
import PrintIcon from './PrintIcon.svg'
import Button from '@/Components/Button'
import { DocumentTypeContext } from '@/contants'
import useTabItem from '../../../../../components_ocean/Logic/Tab/TabItem'
import useSaveApi from './useApi'

const SideBar = (props) => {
  const documentType = useContext(DocumentTypeContext)
  const {
    tabState: { data: { documentActions } = [], data: { values = {} } = {} },
  } = useTabItem({ stateId: documentType })
  const { saveFunc } = useSaveApi({ documentType, values })

  const buttons = useMemo(() => {
    return {
      save: {
        icon: SaveIcon,
        title: 'Сохранить',
        handleClick: saveFunc,
      },
      delete: {
        icon: DeleteIcon,
        title: 'Удалить',
        handleClick: () => null,
      },
      export_doc: {
        icon: OtherIcon,
        title: 'Выгрузить документ',
        handleClick: () => null,
      },
      print_card: {
        icon: PrintIcon,
        title: 'Печать карточки',
        handleClick: () => null,
      },
    }
  }, [saveFunc])

  const documentButtons = useMemo(() => {
    if (!documentActions) {
      return []
    }
    return documentActions?.reduce((acc, { name }) => {
      if (buttons[name]) {
        const { icon, title, handleClick } = buttons[name]
        acc.push(
          <Button
            className="font-weight-light"
            key={title}
            onClick={handleClick}
          >
            <div className="flex items-center">
              <img src={icon} alt="" className="mr-2" />
              <div
                className={
                  'break-words font-size-12 whitespace-pre-line text-left'
                }
              >
                {title}
              </div>
            </div>
          </Button>,
        )
      }
      return acc
    }, [])
  }, [documentActions, buttons])

  return <SidebarContainer>{documentButtons}</SidebarContainer>
}

SideBar.propTypes = {}

export default SideBar
