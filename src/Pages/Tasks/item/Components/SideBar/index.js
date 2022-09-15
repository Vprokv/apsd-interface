import React, {useCallback, useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import {SidebarContainer} from "./styles";
import DeleteIcon from './Group 846.svg'
import SaveIcon from './SaveIcon.svg'
import OtherIcon from './OtherIcon.svg'
import Button from "@/Components/Button";
import {ApiContext, DocumentTypeContext, TASK_ITEM_NEW_DOCUMENT} from "../../../../../contants";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {URL_DOCUMENT_CREATE, URL_DOCUMENT_UPDATE} from "../../../../../ApiList";
import {useNavigate, useParams} from "react-router-dom";

const buttons = {
  save: {
    icon: SaveIcon,
    title: "Сохранить",

  },
  delete: {
    icon: DeleteIcon,
    title: "Удалить"
  },
  export_doc: {
    icon: OtherIcon,
    title: "Выгрузить документ"
  },
  print_card: {
    icon: OtherIcon,
    title: "Печать карточки"
  },
}

const SideBar = props => {
  const api = useContext(ApiContext)
  const documentType = useContext(DocumentTypeContext)
  const {type: typeDoc} = useParams()
  const navigate = useNavigate()


  const {
    tabState: {
      data: {documentActions} = [],
      data: {values = {}} = {},
    }
  } = useTabItem({stateId: documentType})

  const handleClick = (type) => async () => {
    if (type === "save") {
      const {data: {id}} = await api.post(documentType === TASK_ITEM_NEW_DOCUMENT ?
          URL_DOCUMENT_CREATE : URL_DOCUMENT_UPDATE,
        {values, type: typeDoc}
      )

      id && navigate(`/task/${id}/${typeDoc}`)
    }
  }

  const documentButtons = useMemo(() => {
    if (!documentActions) {
      return []
    }
    return documentActions?.reduce((acc, {name}) => {
      if (buttons[name]) {
        const {icon, title} = buttons[name]
        acc.push(
          <Button className="font-weight-light" key={title} onClick={handleClick(name)}>
            <div className="flex items-center break-words font-size-12">
              <img src={icon} alt="" className="mr-2"/>
              {title}
            </div>
          </Button>
        )
      }
      return acc
    }, [])
  }, [documentActions])

  return (
    <SidebarContainer>
      {documentButtons}
    </SidebarContainer>
  );
};

SideBar.propTypes = {};

export default SideBar;