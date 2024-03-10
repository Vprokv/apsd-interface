import React, { useCallback, useContext, useState } from 'react'
import { ApiContext, DocumentTypeContext } from '@/contants'
import { URL_CREATE_STAGE, URL_TEMPLATE, URL_TEMPLATE_LIST } from '@/ApiList'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import BaseCell from '../../../../../../../Components/ListTableComponents/BaseCell'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  LoadContext,
  PermitDisableContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Header from "@Components/Components/Tables/ListTable/header";
import {useBackendColumnSettingsState} from "@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState";

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон добавлен успешно',
    }
  },
}

const plugins = {
  outerSortPlugin: { component: ModifiedSortCellComponent },
  movePlugin: {
    id: URL_TEMPLATE_LIST,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },

  // selectPlugin: {
  //   driver: FlatSelect,
  //   component: CheckBox,
  //   style: { margin: 'auto 0' },
  //   valueKey: 'dsid_template',
  //   returnObjects: true,
  // },
}

const ApplyTemplateWindow = () => {
  const [open, setOpenState] = useState(false)
  const [listTemplates, setListTemplates] = useState([])
  const loadData = useContext(LoadContext)
  const documentId = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const documentType = useContext(DocumentTypeContext)
  const getNotification = useOpenNotification()
  const permit = useContext(PermitDisableContext)

  const columns = [
    {
      id: 'dss_name',
      label: 'Наименование',
      component: BaseCell,
    },
    {
      id: 'r_creation_date',
      label: 'Создан',
      component: BaseCell,
    },
    {
      id: '',
      label: '',
      component: ({ ParentValue: { dsid_template } }) => {
        return (
          <SecondaryBlueButton
            className="text-white flex items-center rounded-lg justify-center"
            onClick={() => applyTemplate(dsid_template)}
          >
            Применить
          </SecondaryBlueButton>
        )
      },
    },
  ]

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const getTemplates = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TEMPLATE_LIST, {
        type: 'ddt_approve_template',
        documentSubtype: documentType,
        isPrivate: true,
      })
      changeModalState(true)()
      setListTemplates(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, documentType, changeModalState, getNotification])

  const createStage = useCallback(
    async (v) => {
      try {
        await api.post(URL_CREATE_STAGE, {
          key: 'approval-sheet',
          documentId,
          stages: v,
        })
        await loadData()
        changeModalState(false)()
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    },
    [api, changeModalState, documentId, getNotification, loadData],
  )

  const applyTemplate = useCallback(
    async (id) => {
      try {
        const { data } = await api.post(URL_TEMPLATE, {
          type: 'ddt_approve_template',
          id: id,
        })
        if (data && data.length > 0) {
          await createStage(data)
          getNotification(customMessagesFuncMap[200]())
        }
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    },
    [api, createStage, getNotification],
  )

  return (
    <>
      {/*<SecondaryBlueButton*/}
      {/*  disabled={permit}*/}
      {/*  className="font-size-12"*/}
      {/*  onClick={getTemplates}*/}
      {/*>*/}
      {/*  Применить шаблон*/}
      {/*</SecondaryBlueButton>*/}
      <StandardSizeModalWindow
        title="Выбор шаблона"
        open={open}
        onClose={changeModalState(false)}
      >
        <ListTable
          value={listTemplates}
          columns={columns}
          plugins={plugins}
          headerCellComponent={HeaderCell}
        />
      </StandardSizeModalWindow>
    </>
  )
}

export default ApplyTemplateWindow
