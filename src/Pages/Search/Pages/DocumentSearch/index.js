import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import {
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_SEARCH_ATTRIBUTES,
  URL_SEARCH_LIST,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { ApiContext, SEARCH_PAGE, TokenContext } from '@/contants'
import {
  getField,
  getLoadFunction,
  mapOfKeyRules,
  parseQueryItemsRules,
} from '@/Pages/Search/Pages/rules'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import {
  defaultOperator,
  keyOperators,
  operators,
} from '@/Pages/Search/constans'
import SearchOperatorSelector from '@/Pages/Search/Pages/Components/SearchOperatorSelector'
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

export const tableConfig = [
  {
    id: 'dss_description',
    label: 'Наименование',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_description = '' },
      },
    }) => <BaseCell className="break-all" value={dss_description} />,
  },
  {
    id: 'dss_type_label',
    label: 'Вид тома',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_type_label = '' },
      },
    }) => <BaseCell value={dss_type_label} />,
  },
  {
    id: 'dss_status_display',
    label: 'Статус',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_status_display = '' },
      },
    }) => <BaseCell value={dss_status_display} />,
  },
  {
    id: 'dsid_startup_complex',
    label: 'Титул',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsid_startup_complex = '' },
      },
    }) => <BaseCell value={dsid_startup_complex} />,
  },
  {
    id: 'Дата регистрации',
    label: 'Дата регистрации',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dsdt_reg_date = '' },
      },
    }) => <BaseCell value={dsdt_reg_date} />,
  },
  {
    id: 'dsdt_creation_date',
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
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Контрольный срок',
    label: 'Контрольный срок',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Автор',
    label: 'Автор',
    sizes: 200,
    component: ({
      ParentValue: {
        valuesCustom: {
          dsid_author_empl: { lastName, middleName, firstName },
        },
      },
    }) => (
      <BaseCell value={() => `${lastName} ${firstName}.  ${middleName}. `} />
    ),
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
    path: 'values.dsid_startup_complex',
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

const DocumentSearch = ({
  documentTypeLoadFunction,
  setSearchState,
  filter,
  setFilter,
  children,
  options,
}) => {
  const api = useContext(ApiContext)
  const [attributes, setAttributes] = useState([])
  const [renderTable, setRenderTable] = useState(false)
  const getNotification = useOpenNotification()
  const { token } = useContext(TokenContext)

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
      ...attributes.map(
        ({
          dss_attr_label,
          dss_attr_name,
          dss_component_type,
          dss_component_reference,
          dss_reference_attr_label,
          dss_reference_attr,
          dss_default_search_operator,
          multiple,
          range,
          ...attributes
        }) => {
          const loadData = getLoadFunction(api)({
            dss_component_reference,
            dss_reference_attr_label,
            dss_reference_attr,
          })

          const mappedOperators = keyOperators.reduce((acc, operator) => {
            if (attributes[operator]) {
              acc.push(operators[operator])
            }
            return acc
          }, [])

          return {
            ...loadData,
            component: SearchOperatorSelector(dss_component_type)(
              getField(dss_component_type),
            ),
            id: dss_attr_name,
            dss_attr_name,
            placeholder: dss_attr_label,
            label: dss_attr_label,
            multiple,
            range,
            operatorOptions: {
              options:
                mappedOperators.length > 0
                  ? mappedOperators
                  : [defaultOperator],
              defaultOption: dss_default_search_operator
                ? operators[dss_default_search_operator].ID
                : defaultOperator.ID,
            },
          }
        },
      ),
    ],
    [api, attributes, documentTypeLoadFunction, options],
  )

  const defaultOperators = useMemo(
    () =>
      fields.reduce((acc, { id, operatorOptions: { defaultOption } = {} }) => {
        acc[id] = defaultOption
        return acc
      }, {}),
    [fields],
  )
  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
        type: filter.type,
      })

      setAttributes(data)
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter.type, getNotification])

  const onSearch = useCallback(async () => {
    setRenderTable(true)
  }, [])

  const attributesComponent = useMemo(
    () =>
      attributes.reduce((acc, { dss_attr_name, dss_component_type }) => {
        acc[dss_attr_name] = dss_component_type
        return acc
      }, {}),
    [attributes],
  )

  const onExportToExcel = useCallback(async () => {
    const { type, ...filters } = filter
    const queryItems = Object.entries(filters).reduce(
      (acc, [key, { value, operator }]) => {
        const {
          [attributesComponent[key]]: rulePars = parseQueryItemsRules.default,
        } = parseQueryItemsRules

        const parseResult = rulePars({ key, value, operator, defaultOperators })
        if (Array.isArray(value)) {
          acc.splice(0, 0, ...parseResult)
        } else {
          acc.push(parseResult)
        }
        return acc
      },
      [],
    )

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
          queryItems,
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
  }, [
    api,
    attributesComponent,
    defaultOperators,
    filter,
    getNotification,
    token,
  ])

  const onRemove = useCallback(() => setFilter({}), [setFilter])

  useEffect(loadData, [loadData])

  // const isSearchDisabled = useMemo(() => {
  //   const { type, ...keys } = filter
  //   return Object.keys(keys).length === 0
  // }, [filter])

  const onCloseTable = useCallback(() => {
    setRenderTable(false)
    setSearchState([])
  }, [setSearchState])

  return (
    <ExportContext.Provider value={'asas'}>
      <div className="flex flex-col w-full p-4 overflow-hidden">
        {renderTable ? (
          <TableSearch
            attributesComponent={attributesComponent}
            defaultOperators={defaultOperators}
            setSearchState={setSearchState}
            filter={filter}
            onExportToExcel={onExportToExcel}
          >
            {children(() => onCloseTable(), onExportToExcel)}
          </TableSearch>
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
              <SecondaryBlueButton className="mb-5 w-64" disabled>
                Применить шаблон
              </SecondaryBlueButton>
              <SecondaryBlueButton className="mb-5 w-64" disabled>
                Сохранить шаблон
              </SecondaryBlueButton>
              <SecondaryGreyButton className="mb-5 w-64" onClick={onRemove}>
                Очистить
              </SecondaryGreyButton>
              <SecondaryGreyButton className="mb-5 w-64" disabled>
                Экспорт
              </SecondaryGreyButton>
            </div>
          </div>
        )}
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

const TableSearch = ({
  children,
  defaultOperators,
  setSearchState,
  filter,
  attributesComponent,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [paginationStateComp, setPaginationStateComp] = useState({})

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SEARCH_PAGE,
    state: paginationStateComp,
    setState: setPaginationStateComp,
    defaultLimit: 10,
  })

  const loadSearch = useCallback(async () => {
    const { type, ...filters } = filter
    const { limit, offset } = paginationState

    const queryItems = Object.entries(filters).reduce(
      (acc, [key, { value, operator }]) => {
        const {
          [attributesComponent[key]]: rulePars = parseQueryItemsRules.default,
        } = parseQueryItemsRules

        const parseResult = rulePars({ key, value, operator, defaultOperators })
        if (Array.isArray(value)) {
          acc.splice(0, 0, ...parseResult)
        } else {
          acc.push(parseResult)
        }
        return acc
      },
      [],
    )

    try {
      const { data } = await api.post(
        `${URL_SEARCH_LIST}?limit=${limit}&offset=${offset}`,
        {
          types: [type],
          inVersions: false,
          queryItems,
        },
      )
      setSearchState(data)
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [
    filter,
    paginationState,
    attributesComponent,
    defaultOperators,
    api,
    setSearchState,
    getNotification,
  ])

  useEffect(loadSearch, [paginationState])

  return (
    <>
      {children}
      <Pagination
        className="mt-2 w-full "
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={10000}
      />
    </>
  )
}

TableSearch.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  filter: PropTypes.object,
  setSearchState: PropTypes.func,
  defaultOperators: PropTypes.object,
  attributesComponent: PropTypes.object,
}
