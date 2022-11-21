import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext, SEARCH_PAGE } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_SEARCH_ATTRIBUTES, URL_TYPE_CONFIG } from '@/ApiList'
import { documentTypes } from '@/Pages/Search/Pages/constans'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Form from '@Components/Components/Forms'
import Titles from '../Components/Titles'
import Buttons from '../Components/Buttons'
import SearchFields from '@/Pages/Search/Pages/Components/SearchFields'
import styled from 'styled-components'
import CheckBoxes from '@/Pages/Search/Pages/Components/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import useButtonFunc from '@/Pages/Search/Pages/useButtonFunc'
import Table from '@/Pages/Search/Pages/Components/Table'
import SearchOperator from '@/Pages/Search/Pages/Components/SearchOperator'

export const Cont = styled(Form)`
  margin: 20px 30px 0 30px;
  display: grid;
  //grid-row-gap: 20px;
  grid-gap: 20px;
  align-items: flex-start;
  width: 100%;
  grid-template-columns: 1fr 3fr 1fr 1fr;
`

const Title = ({ value, onInput }) => {
  const api = useContext(ApiContext)
  const [options, setOptions] = useState([
    {
      typeName: 'ddt_project_calc_type_doc',
      typeLabel: 'Том',
    },
  ])

  const loadFunction = useCallback(async () => {
    const { data } = await api.post(URL_TYPE_CONFIG, {
      type: 'documentType',
      id: 'types',
      filters: {},
      sortType: null,
    })

    setOptions(data)
    return data
  }, [api])

  const input = useMemo(
    () => (
      <LoadableSelect
        placeholder="Выберете тип документа"
        options={options}
        value={value}
        onInput={onInput}
        loadFunction={loadFunction}
        valueKey="typeName"
        labelKey="typeLabel"
      />
    ),
    [loadFunction, onInput, options, value],
  )

  return (
    <Cont>
      <div className="flex h-10 font-size-14 items-center">Тип документа</div>
      {input}
    </Cont>
  )
}

const Documents = (props) => {
  const api = useContext(ApiContext)
  // const [checked, setChecked] = useState(() => new Map())
  const [operator, setOperator] = useState(() => new Map())

  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const {
    tabState,
    setTabState,
    tabState: { value = 'ddt_project_calc_type_doc' },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
      type: value,
    })

    return data
  }, [api, value])

  const onInput = useCallback((value) => setTabState({ value }), [setTabState])

  useAutoReload(loadData, tabItemState)

  const getButtonFunc = useButtonFunc({
    operator,
    tabState,
    setTabState,
  })

  return (
    <TabStateContext.Provider
      value={{
        tabState,
        setTabState,
        value,
        getButtonFunc,
        // checked,
        // setChecked,
        operator,
        setOperator,
      }}
    >
      <div className="flex flex-col">
        <Title value={value} onInput={onInput} />
        <Cont>
          <Titles />
          <SearchFields />
          {/*<CheckBoxes />*/}
          <SearchOperator />
          <Buttons />
        </Cont>
        <Table />
      </div>
    </TabStateContext.Provider>
  )
}

Documents.propTypes = {}

export default Documents
