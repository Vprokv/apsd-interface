import React, { useCallback, useContext, useState } from 'react'
import { ApiContext, DocumentTypeContext } from '@/contants'
import { URL_CREATE_STAGE, URL_TEMPLATE, URL_TEMPLATE_LIST } from '@/ApiList'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import BaseCell from '../../../../../../../Components/ListTableComponents/BaseCell'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
  },
}

const ApplyTemplateWindow = () => {
  const [open, setOpenState] = useState(false)
  const [listTemplates, setListTemplates] = useState([])
  const loadData = useContext(LoadContext)
  const documentId = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const documentType = useContext(DocumentTypeContext)

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
    // {
    //   id: ,
    //   label: 'Примечание',
    // }
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
    const { data } = await api.post(URL_TEMPLATE_LIST, {
      type: 'ddt_approve_template',
      documentSubtype: documentType,
      isPrivate: true,
    })
    changeModalState(true)()
    setListTemplates(data)
  }, [changeModalState, api, listTemplates])

  const applyTemplate = useCallback(
    async (id) => {
      const { data } = await api.post(URL_TEMPLATE, {
        type: 'ddt_approve_template',
        id: id,
      })
      if (data && data.length > 0) {
        createStage(data)
      }
    },
    [api],
  )

  const createStage = useCallback(
    async (v) => {
      await api.post(URL_CREATE_STAGE, {
        key: 'approval-sheet',
        documentId,
        stages: v,
      })
      await loadData()
      changeModalState(false)()
    },
    [api, loadData],
  )
  return (
    <>
      <Button
        className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
        onClick={getTemplates}
      >
        Применить шаблон
      </Button>
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
