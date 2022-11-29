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
import {
  URL_ENTITY_LIST,
  URL_SEARCH_ATTRIBUTES,
  URL_TYPE_CONFIG,
} from '@/ApiList'
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
import { FilterForm } from '@/Pages/Search/Pages/Components/SearchFields/styles'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import Title from '@/Pages/Search/Pages/Documents/Components/Title'

export const Cont = styled(Form)`
  margin-top: 20px;
  display: grid;
  //grid-row-gap: 20px;
  grid-gap: 20px;
  align-items: flex-start;
  width: 100%;
  grid-template-columns: 3fr 1fr 1fr;
`

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
    tabState: { value = 'ddt_startup_complex_type_doc' },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
      type: value,
    })

    return data
  }, [api, value])

  const onInput = useCallback((value) => setTabState({ value }), [setTabState])

  useAutoReload(loadData, tabItemState)

  // const getButtonFunc = useButtonFunc({
  //   operator,
  //   tabState,
  //   setTabState,
  // })

  return (
    <TabStateContext.Provider
      value={{
        tabState,
        setTabState,
        value,
        // getButtonFunc,
        // checked,
        // setChecked,
        operator,
        setOperator,
      }}
    >
      <div className="flex flex-col mx-4">
        <Title value={value} onInput={onInput} />
        <Cont>
          <SearchFields />
          <SearchOperator />
          <Buttons setTabState={setTabState} operator={operator} />
        </Cont>
        <Table />
      </div>
    </TabStateContext.Provider>
  )
}

Documents.propTypes = {}

export default Documents
