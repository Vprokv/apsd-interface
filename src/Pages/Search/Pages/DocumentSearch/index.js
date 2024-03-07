import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import {
  URL_CREATE_TEMPLATE,
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_SEARCH_ATTRIBUTES,
  URL_SEARCH_LIST,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import {
  ApiContext,
  SEARCH_PAGE,
  SEARCH_PAGE_DOCUMENT,
  TokenContext,
} from '@/contants'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import { ExportContext } from '../constans'
import ScrollBar from '@Components/Components/ScrollBar'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import Pagination from '@/Components/Pagination'
import usePagination from '@Components/Logic/usePagination'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useParseConfig from '@/Utils/Parser'
import { searchParserStages } from '@/Pages/Search/Parser'
import attributesAdapter from '@/Pages/Search/Parser/attributesAdapter'
import buildSearchQuery from '@/Pages/Search/Utils/buildSearchRequest'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'
import SearchTemplateWindowList from '@/Pages/Search/Pages/DocumentSearch/Components/SearchTemplateWindowList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

export const tableConfig = [
  {
    id: 'values.dss_description',
    label: 'Наименование',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_description = '' },
      },
    }) => <BaseCell className="break-all" value={dss_description} />,
  },
  {
    id: 'values.dss_reg_number',
    label: 'Шифр/Рег.номер',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_reg_number, dss_document_type = '' },
      },
    }) => (
      <BaseCell
        value={
          dss_document_type === 'ddt_project_calc_type_doc'
            ? dss_reg_number
            : ''
        }
      />
    ),
  },
  {
    id: 'values.dss_type_label',
    label: 'Вид тома',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_type_label = '' },
      },
    }) => <BaseCell value={dss_type_label} />,
  },
  {
    id: 'values.dss_status_display',
    label: 'Статус',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_status_display = '' },
      },
    }) => <BaseCell value={dss_status_display} />,
  },
  {
    id: 'values.dsid_startup_complex_display',
    label: 'Титул',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsid_startup_complex_display = '' },
      },
    }) => <BaseCell value={dsid_startup_complex_display} />,
  },
  {
    id: 'values.dsdt_reg_date',
    label: 'Дата регистрации',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsdt_reg_date = '' },
      },
    }) => <BaseCell value={dsdt_reg_date} />,
  },
  {
    id: 'values.dsdt_creation_date',
    label: 'Дата создания',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsdt_creation_date = '' },
      },
    }) => (
      <BaseCell className="flex " value={dsdt_creation_date} /> // items-center
    ),
  },
  {
    id: 'Этап',
    label: 'Этап',
    sizes: 200,
    component: () => <BaseCell />,
  },
  {
    id: 'Контрольный срок',
    label: 'Контрольный срок',
    sizes: 200,
    component: () => <BaseCell />,
  },
  {
    id: 'valuesCustom.dsid_author_empl.fio',
    label: 'Автор',
    sizes: 200,
    component: ({
      ParentValue: {
        valuesCustom: {
          dsid_author_empl: { fio },
        },
      },
    }) => <BaseCell value={fio} />,
  },
]

const columnsMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Наименование',
    path: 'values.dss_description',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Шифр/Рег.номер',
    path: 'values.dss_reg_number',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Вид тома',
    path: 'values.dss_type_label',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Статус',
    path: 'values.dss_status',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Титул',
    path: 'values.dsid_startup_complex_display',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата регистрации',
    path: 'values.dsdt_reg_date',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата создания',
    path: 'values.dsdt_creation_date',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Этап',
    path: 'a',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Контрольный срок',
    path: 'a',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор',
    path: '[valuesCustom.dsid_author_empl.lastName,valuesCustom.dsid_author_empl.middleName,firstName]',
  },
]

const baseSortQuery = {
  key: 'values.dsdt_creation_date',
  direction: 'DESC',
}

const DocumentSearch = ({
  documentTypeLoadFunction,
  setSearchState,
  filter,
  setFilter,
  setLoading,
  children,
  options,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const { token } = useContext(TokenContext)
  const [paginationStateComp, setPaginationStateComp] = useState({})

  const [tabState, setTabState] = useTabItem({
    stateId: SEARCH_PAGE_DOCUMENT,
  })

  const {
    renderTable = false,
    searchState: { total = 0 } = {},
    sortQuery = baseSortQuery,
  } = tabState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SEARCH_PAGE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
        type: filter.type,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter.type, getNotification])

  const [{ data: attributes }] = useAutoReload(loadData, tabState, setTabState)

  const { fields: parsedFields } = useParseConfig({
    value: filter,
    stages: searchParserStages,
    fieldsDesign: useMemo(
      () => attributes?.map(attributesAdapter),
      [attributes],
    ),
  })

  const [openCreateTemplateWindow, setOpenCreateTemplateWindowState] =
    useState(false)
  const [openUseTemplateWindowState, setOpenUseTemplateWindowState] =
    useState(false)
  const changeCreateTemplateWindowState = useCallback(
    (nextState) => () => {
      setOpenCreateTemplateWindowState(nextState)
    },
    [],
  )
  const changeUseTemplateWindowState = useCallback(
    (nextState) => () => {
      setOpenUseTemplateWindowState(nextState)
    },
    [],
  )

  const fields = useMemo(
    () => [
      {
        id: 'type',
        component: AutoLoadableSelect,
        placeholder: 'Выберите тип документа',
        label: 'Выберите тип документа',
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options,
        loadFunction: documentTypeLoadFunction(api),
      },
      ...parsedFields,
    ],
    [api, documentTypeLoadFunction, options, parsedFields],
  )

  const onSearch = useCallback(async () => {
    setTabState({ renderTable: true })
    setLoading(true)
    const { type, ...filters } = filter
    const { limit, offset } = paginationState

    try {
      const { data } = await api.post(
        `${URL_SEARCH_LIST}?limit=${limit}&offset=${offset}`,
        {
          types: [type],
          inVersions: false,
          queryItems: buildSearchQuery(filters),
          orderBy: sortQuery.key,
          sortType: sortQuery.direction,
        },
      )
      setSearchState(data)
      setLoading(false)
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
      setLoading(false)
    }
  }, [
    api,
    filter,
    getNotification,
    paginationState,
    setLoading,
    setSearchState,
    setTabState,
    sortQuery.direction,
    sortQuery.key,
  ])

  useEffect(onSearch, [sortQuery, paginationState])

  const onExportToExcel = useCallback(async () => {
    const { type, ...filters } = filter

    try {
      const {
        data: { id },
      } = await api.post(URL_EXPORT, {
        url: `${API_URL}${URL_SEARCH_LIST}`,
        label: 'Поиск по документам',
        sheetName: 'Поиск по документам',
        columns: columnsMap,
        body: {
          types: [type],
          inVersions: false,
          queryItems: buildSearchQuery(filters),
          token,
        },
      })

      const { data } = await api.get(`${URL_EXPORT_FILE}${id}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, 'Поиск по документам.xlsx')
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter, getNotification, token])

  const onRemove = useCallback(() => setFilter({}), [setFilter])

  useEffect(loadData, [loadData])

  const onCloseTable = useCallback(() => {
    setTabState({ renderTable: false })
    setSearchState([])
  }, [setSearchState, setTabState])

  useEffect(() => {
    if (!renderTable) {
      const onKeyEnterDown = (e) => {
        e.key === 'Enter' && onSearch()
      }

      document.addEventListener('keydown', onKeyEnterDown)
      return () => {
        document.removeEventListener('keydown', onKeyEnterDown)
      }
    }
  }, [onSearch, renderTable])

  return (
    <ExportContext.Provider value={'asas'}>
      <div className="flex flex-col w-full p-4 overflow-hidden">
        {renderTable ? (
          <>
            {children(() => onCloseTable(), onExportToExcel)}
            <Pagination
              className="mt-2 w-full "
              limit={paginationState.limit}
              page={paginationState.page}
              setLimit={setLimit}
              setPage={setPage}
              total={
                total === paginationState.limit
                  ? 10000
                  : paginationState.endItemValue
              }
              disabled={true}
            />
          </>
        ) : (
          <div className="flex overflow-hidden">
            <ScrollBar className="w-full">
              <Form
                className=" grid grid-row-gap-5 h-min mr-4"
                value={filter}
                onInput={setFilter}
                fields={fields}
                inputWrapper={RowInputWrapper}
              />
            </ScrollBar>
            <div className="flex flex-col">
              <LoadableSecondaryOverBlueButton
                className="mb-5 w-64"
                onClick={onSearch}
                // disabled={isSearchDisabled}
              >
                Искать
              </LoadableSecondaryOverBlueButton>
              <SecondaryOverBlueButton
                className="mb-5 w-64"
                onClick={changeUseTemplateWindowState(true)}
              >
                Применить шаблон
              </SecondaryOverBlueButton>
              <SecondaryOverBlueButton
                className="mb-5 w-64"
                onClick={changeCreateTemplateWindowState(true)}
                disabled={Object.keys(filter).length < 2}
              >
                Сохранить шаблон
              </SecondaryOverBlueButton>
              <SecondaryGreyButton className="mb-5 w-64" onClick={onRemove}>
                Очистить
              </SecondaryGreyButton>
              <SecondaryGreyButton className="mb-5 w-64" disabled>
                Экспорт
              </SecondaryGreyButton>
            </div>
          </div>
        )}
        <CreateWindow
          open={openCreateTemplateWindow}
          onReverse={changeCreateTemplateWindowState(false)}
          changeModalState={changeCreateTemplateWindowState}
          value={filter}
          type={'ddt_query_template'}
          createFunc={(api) => (parseResult) => (type) => async (json) => {
            return await api.post(URL_CREATE_TEMPLATE, {
              template: {
                ...parseResult,
                json,
              },
              type,
            })
          }}
        />
        <SearchTemplateWindowList
          open={openUseTemplateWindowState}
          changeModalState={changeUseTemplateWindowState}
          setGlobalFilter={setFilter}
          type={'ddt_query_template'}
          title={'Выберите шаблон поиска'}
          // searchFunc={(api) => (searchBody) => async (reportId) => {
          //   return await api.post(URL_TEMPLATE_LIST, {
          //     reportId,
          //     ...searchBody,
          //   })
          // }}
        />
      </div>
    </ExportContext.Provider>
  )
}

DocumentSearch.propTypes = {
  documentTypeLoadFunction: PropTypes.func,
  options: PropTypes.array,
  children: PropTypes.func,
  filter: PropTypes.object,
  setSearchState: PropTypes.func,
  setFilter: PropTypes.func,
}

DocumentSearch.defaultProps = {
  documentTypeLoadFunction: (api) => async () => {
    const { data } = await api.post(`${URL_TYPE_CONFIG}?limit=100&offset=0`, {
      type: 'documentType',
      id: 'types',
      filters: {},
      sortType: null,
    })
    return data
  },
  options: [
    {
      typeName: 'ddt_startup_complex_type_doc',
      typeLabel: 'Титул',
    },
  ],
}

export default DocumentSearch
