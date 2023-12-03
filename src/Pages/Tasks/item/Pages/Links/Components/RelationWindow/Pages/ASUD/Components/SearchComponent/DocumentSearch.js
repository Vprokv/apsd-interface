import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  URL_SEARCH_ATTRIBUTES,
  URL_SEARCH_LIST,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useParseConfig from '@/Utils/Parser'
import { searchParserStages } from '@/Pages/Search/Parser'
import attributesAdapter from '@/Pages/Search/Parser/attributesAdapter'
import buildSearchQuery from '@/Pages/Search/Utils/buildSearchRequest'

export const tableConfig = [
  {
    id: 'dss_description',
    label: 'Наименование',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_description = '' },
      },
    }) => <BaseCell value={dss_description} />,
  },
  {
    id: 'dss_type_label',
    label: 'Вид Тома',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_type_label = '' },
      },
    }) => <BaseCell value={dss_type_label} />,
  },
  {
    id: 'dss_status',
    label: 'Статус',
    sizes: 200,
    component: ({
      ParentValue: {
        values: { dss_status = '' },
      },
    }) => <BaseCell value={dss_status} />,
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
      <BaseCell className="flex" value={dsdt_creation_date} /> // items-center
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
      <BaseCell
        value={
          // eslint-disable-next-line react-hooks/rules-of-hooks
          (useMemo(() => `${lastName} ${firstName}.  ${middleName}. `),
          [lastName, middleName, firstName])
        }
      />
    ),
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
  const { fields: parsedFields } = useParseConfig({
    value: filter,
    stages: searchParserStages,
    fieldsDesign: useMemo(
      () => attributes.map(attributesAdapter),
      [attributes],
    ),
  })

  const fields = useMemo(
    () => [
      {
        id: 'type',
        component: LoadableSelect,
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
    try {
      const { type, ...filters } = filter

      const { data } = await api.post(URL_SEARCH_LIST, {
        types: [type],
        sedoSearch: true,
        inVersions: false,
        queryItems: buildSearchQuery(filters),
      })
      setSearchState(data)
      setRenderTable(true)
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, filter, getNotification, setSearchState])

  const onRemove = useCallback(() => setFilter({}), [setFilter])

  useEffect(loadData, [loadData])

  const isSearchDisabled = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const { type, ...keys } = filter
    return Object.keys(keys).length === 0
  }, [filter])

  return (
    <div className="flex flex-col w-full p-4 overflow-hidden">
      {renderTable ? (
        children(() => setRenderTable(false))
      ) : (
        <div className="flex overflow-hidden">
          <Form
            className="w-full grid grid-row-gap-5 h-min mr-4"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
          <div className="flex flex-col">
            <LoadableSecondaryOverBlueButton
              className="mb-5 w-64"
              onClick={onSearch}
              disabled={isSearchDisabled}
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
  )
}

DocumentSearch.propTypes = {
  documentTypeLoadFunction: PropTypes.func,
  options: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  filter: PropTypes.object,
  setSearchState: PropTypes.func,
  setFilter: PropTypes.func,
}

DocumentSearch.defaultProps = {
  documentTypeLoadFunction: (api) => async () => {
    const { data } = await api.post(`${URL_TYPE_CONFIG}?limit=100&offset=0`, {
      // type: 'documentType',
      // id: 'types',
      // filters: {},
      // sortType: null,
      typeConfig: 'ddt_sedo_search_type_doc',
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
