import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TokenContext } from '@/contants'
import {
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_SEARCH_ATTRIBUTES,
  URL_SEARCH_LIST,
} from '@/ApiList'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/Forms/ValidationStateUi/RowInputWrapper'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import buildSearchQuery from '@/Pages/Search/Utils/buildSearchRequest'
import useParseConfig from '@/Utils/Parser'
import { searchParserStages } from '@/Pages/Search/Parser'
import attributesAdapter from '@/Pages/Search/Parser/attributesAdapter'

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
  // {
  //   componentType: 'DescriptionTableColumn',
  //   header: 'Этап',
  //   path: '',
  // },
  // {
  //   componentType: 'DescriptionTableColumn',
  //   header: 'Контрольный срок',
  //   path: '',
  // },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор',
    path: '[valuesCustom.dsid_author_empl.lastName,valuesCustom.dsid_author_empl.middleName,firstName]',
  },
]

const TaskSearch = ({ setSearchState, filter, setFilter, children }) => {
  const api = useContext(ApiContext)
  const [attributes, setAttributes] = useState([])
  const [renderTable, setRenderTable] = useState(false)
  const { token } = useContext(TokenContext)
  const getNotification = useOpenNotification()
  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
        type: filter.type,
      })

      setAttributes(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter.type, getNotification])

  useEffect(loadData, [loadData])

  const { fields } = useParseConfig({
    value: filter,
    stages: searchParserStages,
    fieldsDesign: useMemo(
      () => attributes.map(attributesAdapter),
      [attributes],
    ),
  })

  const onSearch = useCallback(async () => {
    const { type, ...filters } = filter
    try {
      const { data } = await api.post(URL_SEARCH_LIST, {
        types: [type],
        inVersions: false,
        queryItems: buildSearchQuery(filters),
      })
      setSearchState(data)
      setRenderTable(true)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, setSearchState])

  const onRemove = useCallback(
    () => setFilter({ type: filter.type }),
    [filter.type, setFilter],
  )

  const isSearchDisabled = useMemo(() => {
    const { type, ...keys } = filter
    return Object.keys(keys).length === 0
  }, [filter])

  const onExportToExcel = useCallback(async () => {
    const { type, ...filters } = filter

    try {
      const {
        data: { id },
      } = await api.post(URL_EXPORT, {
        url: `${API_URL}${URL_SEARCH_LIST}`,
        label: 'Поиск по задания',
        sheetName: 'Поиск по задания',
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

      downloadFileWithReload(data, 'Поиск по заданиям.xlsx')
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, token])

  return (
    <div className="flex  w-full p-6 overflow-hidden">
      {renderTable ? (
        children(() => setRenderTable(false), onExportToExcel)
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

TaskSearch.propTypes = {
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

TaskSearch.defaultProps = {}

export default TaskSearch
