import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TokenContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import useParseConfig from '@/Utils/Parser'
import { searchParserStages } from '@/Pages/Search/Parser'
import attributesAdapter from '@/Pages/Search/Parser/attributesAdapter'
import {
  URL_CREATE_TEMPLATE,
  URL_SEARCH_ATTRIBUTES,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import ScrollBar from '@Components/Components/ScrollBar'
import Form from '@Components/Components/Forms'
import RowInputWrapper from '@/Components/ListTableComponents/RowInputWrapper'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import { useNavigate, useParams } from 'react-router-dom'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'

const defaultFilter = { type: 'ddt_project_calc_type_doc' }

const defaultOptions = [
  {
    typeName: 'ddt_project_calc_type_doc',
    typeLabel: 'Том',
  },
]

const SearchTemplateTab = () => {
  const [filter, setFilter] = useState(defaultFilter)
  const api = useContext(ApiContext)
  const [attributes, setAttributes] = useState([])
  const { onInput } = useContext(TemplateTabStateContext)
  const navigate = useNavigate()
  const getNotification = useOpenNotification()
  const [open, setOpenState] = useState(false)
  const { ['*']: type } = useParams()
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

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
        component: AutoLoadableSelect,
        placeholder: 'Выберите тип документа',
        label: 'Выберите тип документа',
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options: defaultOptions,
        loadFunction: async () => {
          const { data } = await api.post(
            `${URL_TYPE_CONFIG}?limit=100&offset=0`,
            {
              type: 'documentType',
              id: 'types',
              filters: {},
              sortType: null,
            },
          )
          return data
        },
      },
      ...parsedFields,
    ],
    [api, parsedFields],
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

  useEffect(loadData, [loadData])

  return (
    <div className="flex-container  w-full p-4 overflow-hidden">
      <div className="flex flex-col h-full w-full overflow-hidden">
        <ScrollBar className="m-4 h-full w-full">
          <Form
            className=" grid grid-row-gap-5 h-min mr-4 h-full"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={RowInputWrapper}
          />
        </ScrollBar>
        <div className="flex items-start h-32">
          <SecondaryOverBlueButton
            disabled={Object.keys(filter).length < 2}
            className=" w-64"
            onClick={changeModalState(true)}
          >
            Сохранить шаблон
          </SecondaryOverBlueButton>
          <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
            Отменить
          </SecondaryGreyButton>
        </div>
      </div>
      <CreateWindow
        open={open}
        onReverse={onReverse}
        changeModalState={changeModalState}
        value={filter}
        type={type}
        createFunc={(api) => (parseResult) => (type) => async (json) => {
          const data = await api.post(URL_CREATE_TEMPLATE, {
            template: {
              ...parseResult,
              json,
            },
            type,
          })
          return data
        }}
      />
    </div>
  )
}

SearchTemplateTab.propTypes = {}

export default SearchTemplateTab
