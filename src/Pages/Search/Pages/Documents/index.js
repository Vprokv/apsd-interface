import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiContext, SEARCH_PAGE } from '@/contants'
import useTabItem from '@apsd/components/Logic/Tab/TabItem'
import { URL_SEARCH_ATTRIBUTES, URL_TYPE_CONFIG } from '@/ApiList'
import { documentTypes } from '@/Pages/Search/Pages/constans'
import useAutoReload from '@apsd/components/Logic/Tab/useAutoReload'
import Form from '@apsd/components/Components/Forms'
import Titles from '../Components/Titles'
import Buttons from '../Components/Buttons'
import SearchFields from '@/Pages/Search/Pages/Components/SearchFields'
import styled from 'styled-components'
import CheckBoxes from '@/Pages/Search/Pages/Components/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import { TabStateContext } from '@/Pages/Search/Pages/constans'

export const Cont = styled(Form)`
  margin: 20px 30px 0 30px;
  display: grid;
  grid-row-gap: 20px;
  align-items: flex-start;
  grid-template-columns: 1fr 3fr 1fr 1fr;
  //grid-row-gap: 15px;
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
  // const [qq, onInput] = useState('ddt_project_calc_type_doc')

  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const {
    tabState,
    setTabState,
    tabState: { data = [], value = 'ddt_project_calc_type_doc' },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
      type: value,
    })

    return data
  }, [api, value])

  const onInput = useCallback((value) => setTabState({ value }), [setTabState])

  useAutoReload(loadData, tabItemState)

  return (
    <TabStateContext.Provider value={{ tabState, setTabState }}>
      <div className="flex flex-col">
        <Title value={value} onInput={onInput} />
        <Cont>
          <Titles data={data} />
          <SearchFields data={data} />
          <CheckBoxes data={data} />
          <Buttons />
        </Cont>
      </div>
    </TabStateContext.Provider>
  )
}

Documents.propTypes = {}

export default Documents
