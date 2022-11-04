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
import SideBarButton from '@/Pages/Tasks/item/Components/SideBar/SideBarButton'

const SideBar = (props) => {
  const documentType = useContext(DocumentTypeContext)
  const {
    tabState: { data: { documentActions } = [], data: { values = {} } = {} },
    initialState,
  } = useTabItem({ stateId: documentType })
  const getFunc = useSaveApi({ documentType, values, initialState })

  const buttons = useMemo(() => {
    return {
      save: {
        icon: SaveIcon,
        title: 'Сохранить',
        type: 'save',
      },
      delete: {
        icon: DeleteIcon,
        title: 'Удалить',
        type: 'delete',
      },
      export_doc: {
        icon: OtherIcon,
        title: 'Выгрузить документ',
        type: 'export_doc',
      },
      sent_to_curator: {
        icon: PrintIcon,
        title: 'Печать карточки',
        type: 'sent_to_curator',
      },
      print_card: {
        icon: OtherIcon,
        title: 'Отправить куратору',
        type: 'print_card',
      },
    }
  }, [])

  const documentButtons = useMemo(() => {
    if (!documentActions) {
      return []
    }

    return documentActions?.reduce((acc, button) => {
      acc.push(
        <SideBarButton
          key={button.name}
          button={button}
          func={getFunc(button.name)}
        />,
      )
      return acc
    }, [])
  }, [documentActions, getFunc])

  return <SidebarContainer>{documentButtons}</SidebarContainer>
}

SideBar.propTypes = {}

export default SideBar
