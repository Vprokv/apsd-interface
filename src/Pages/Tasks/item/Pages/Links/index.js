import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_ENTITY_LIST,
  URL_LINK_DELETE,
  URL_LINK_LIST,
  URL_PREVIEW_DOCUMENT,
  URL_DOWNLOAD_FILE,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { FilterForm } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, SecondaryGreyButton, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import LinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow'
import EditLinksWindow from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow'
import DownloadIcon from '@/Icons/DownloadIcon'
import { UpdateContext } from '@/Pages/Tasks/item/Pages/Links/constans'
import downloadFile from '@/Utils/DownloadFile'
import { FormWindow } from '@/Components/ModalWindow'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { TokenContext } from '@/contants'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'contentId',
    returnObjects: true,
  },
}

const columns = [
  {
    id: 'documentTypeLabel',
    label: 'Документ',
    className: 'h-10 flex items-center',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 200,
  },
  {
    id: 'description',
    label: 'Краткое содержание',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 250,
  },
  {
    id: 'authorFullName',
    label: 'Автор',
    component: BaseCell,
    sizes: 150,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all"
        {...props}
      />
    ),
    sizes: 220,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    component: BaseCell,
    sizes: 220,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    component: BaseCell,
    sizes: 220,
  },
]

const Links = () => {
  const { type } = useParams()
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [errorState, setErrorState] = useState()

  const { token } = useContext(TokenContext)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_LINK,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change },
  } = tabItemState

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_LINK_LIST, {
      parentId: id,
      filter,
    })

    return data
  }, [api, id, type, change])

  useAutoReload(loadData, tabItemState)

  const downLoadContent = useCallback(async () => {
    let errorString = ''

    const res = await Promise.all(
      selectState.reduce((acc, { contentId, documentTypeLabel }) => {
        if (documentTypeLabel) {
          acc.push(
            new Promise((res) => {
              api
                .post(
                  URL_DOWNLOAD_FILE,
                  {
                    type: 'ddt_document_content',
                    column: 'dsc_content',
                    id: contentId,
                  },
                  { responseType: 'blob' },
                )
                .then((response) => {
                  console.log(response.headers['Content-Disposition'])
                  res(response.data)
                })
                .catch(() => res(new Error('Документ не найден')))
            }),
          )
        }
        return acc
      }, []),
    )

    res.forEach((val, i) => {
      if (val instanceof Error) {
        errorString = `${errorString}, Документ ${selectState[i]?.documentTypeLabel} не найден`
      } else {
        downloadFile(val, selectState[i]?.documentTypeLabel)
      }
    })

    if (errorString.length) {
      setErrorState(errorString.trim())
    }
  }, [api, selectState])

  const disabled = useMemo(() => !selectState.length > 0, [selectState])

  const fields = useMemo(
    () => [
      {
        id: 'documentType',
        component: LoadableSelect,
        placeholder: 'Тип документа',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'authorName',
        component: UserSelect,
        placeholder: 'Автор связи',
        valueKey: 'userName',
      },
      {
        id: 'linkType',
        component: LoadableSelect,
        placeholder: 'Тип связи',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
          })
          return data
        },
      },
    ],
    [api],
  )

  const onDelete = useCallback(async () => {
    await api.post(URL_LINK_DELETE, { linkIds: selectState })
  }, [api, selectState])

  const previewDocument = useCallback(async () => {
    const { data } = await api.get(
      `${URL_PREVIEW_DOCUMENT}:${selectState[0].contentId}:${token}`,
    )
  }, [api, selectState])

  return (
    <UpdateContext.Provider value={setChange}>
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <FilterForm
            className="mr-2"
            value={filter}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <FormWindow open={errorState} onClose={() => setErrorState('')}>
              <div className="text-center mt-4 mb-12">{errorState}</div>
              <SecondaryGreyButton
                type="button"
                className="w-40 m-auto"
                onClick={() => setErrorState('')}
              >
                Закрыть
              </SecondaryGreyButton>
            </FormWindow>
            <LinksWindow />
            <ButtonForIcon
              onClick={downLoadContent}
              disabled={disabled}
              className="mr-2 color-text-secondary"
            >
              <Icon icon={DownloadIcon} />
            </ButtonForIcon>
            <EditLinksWindow value={selectState} />
            <ButtonForIcon
              onClick={onDelete}
              disabled={!selectState.length}
              className="color-text-secondary"
            >
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </div>
        </div>
        <div className="flex items-center py-4 form-element-sizes-32">
          <SecondaryBlueButton onClick={previewDocument}>
            Предпросмотр
          </SecondaryBlueButton>
        </div>
        <ListTable
          rowComponent={useMemo(
            () => (props) =>
              <RowComponent onDoubleClick={() => null} {...props} />,
            [],
          )}
          value={data}
          columns={columns}
          plugins={plugins}
          headerCellComponent={HeaderCell}
          selectState={selectState}
          onSelect={setSelectState}
          sortQuery={sortQuery}
          onSort={onSort}
          valueKey="id"
        />
      </div>
    </UpdateContext.Provider>
  )
}

Links.propTypes = {}

export default Links
