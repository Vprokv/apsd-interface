import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import { getField, getLoadFunction } from '@/Pages/Search/Pages/rules'
import {
  defaultOperator,
  keyOperators,
  operators,
} from '@/Pages/Search/constans'
import SearchOperatorSelector from '@/Pages/Search/Pages/Components/SearchOperatorSelector'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_SEARCH_LIST } from '@/ApiList'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'

const attrib = [
  {
    dss_attr_name: 'type',
    dss_attr_label: 'Тип документа',
    dss_component_type: 'Combobox',
    multiple: false,
  },
  {
    dss_attr_name: 'dss_reg_number',
    dss_attr_label: 'Шифр/Рег. номер',
    dss_component_type: 'Text',
    multiple: false,
  },
  {
    dss_attr_name: 'Штрихкод',
    dss_attr_label: 'Штрихкод',
    dss_component_type: 'Text',
    multiple: false,
  },
  {
    dss_attr_name: 'dss_date-reg',
    dss_attr_label: 'Дата регистрации документа',
    range: true,
    dss_component_type: 'Date',
    multiple: false,
  },
  {
    dss_attr_name: 'Автор',
    dss_attr_label: 'Автор',
    dss_component_type: 'UserSelect',
    multiple: false,
  },
  {
    dss_attr_name: 'задания',
    dss_attr_label: 'Тип задания',
    dss_component_type: 'Combobox',
    multiple: true,
  },
  {
    dss_attr_name: 'dsid_state',
    dss_attr_label: 'Состояние задания',
    dss_component_type: 'Combobox',
    dss_component_reference: 'ddt_state',
    multiple: false,
  },
  {
    dss_attr_name: 'dsid_signer_empl',
    dss_attr_label: 'Исполнитель',
    dss_component_type: 'UserSelect',
    multiple: false,
  },
  {
    dss_attr_name: 'Дата создания',
    dss_attr_label: 'Дата создания',
    range: true,
    dss_component_type: 'Date',
    multiple: false,
  },
  {
    dss_attr_name: 'Контрольный срок',
    dss_attr_label: 'Контрольный срок',
    range: true,
    dss_component_type: 'Date',
    multiple: false,
  },
  {
    dss_attr_name: 'Дата выполнения',
    dss_attr_label: 'Дата выполнения',
    range: true,
    dss_component_type: 'Date',
    multiple: false,
  },
  {
    dss_attr_name: 'Исполнитель',
    dss_attr_label: 'Исполнитель',
    dss_component_type: 'UserSelect',
    multiple: false,
  },
  {
    dss_attr_name: 'Полнотестовый поиск',
    dss_attr_label: 'Полнотестовый поиск',
    dss_component_type: 'Text',
    multiple: false,
  },
]

const TaskSearch = ({
  documentTypeLoadFunction,
  setSearchState,
  filter,
  setFilter,
  children,
}) => {
  const api = useContext(ApiContext)
  // const [attributes, setAttributes] = useState([])
  const [renderTable, setRenderTable] = useState(false)

  const fields = useMemo(
    () =>
      attrib.map(
        ({
          dss_attr_label,
          dss_attr_name,
          dss_component_type,
          dss_component_reference,
          dss_default_search_operator,
          multiple,
          range,
          ...attributes
        }) => {
          const loadData = getLoadFunction(api)(dss_component_reference)

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
    [api],
  )

  const defaultOperators = useMemo(
    () =>
      fields.reduce((acc, { id, operatorOptions: { defaultOption } = {} }) => {
        acc[id] = defaultOption
        return acc
      }, {}),
    [fields],
  )

  const onSearch = useCallback(async () => {
    const queryItems = Object.entries(filter).reduce(
      (acc, [key, { value, operator }]) => {
        acc.push({
          attr: key,
          operator: operator || defaultOperators[key],
          arguments: [value],
        })
        return acc
      },
      [],
    )

    const { data } = await api.post(URL_SEARCH_LIST, {
      inVersions: false,
      queryItems,
    })
    setSearchState(data)
    setRenderTable(true)
  }, [api, defaultOperators, filter, setSearchState])

  const onRemove = useCallback(() => setFilter({}), [])

  const isSearchDisabled = useMemo(
    () => (filter && Object?.keys(filter)?.length === 0) || true,
    [filter],
  )

  return (
    <div className="flex w-full p-6">
      {renderTable ? (
        children(() => setRenderTable(false))
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

TaskSearch.propTypes = {}

TaskSearch.defaultProps = {}

export default TaskSearch
