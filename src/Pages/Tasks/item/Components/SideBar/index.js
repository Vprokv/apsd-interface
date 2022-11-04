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
