import React, { useCallback, useContext, useState } from 'react'
import { ApiContext, SEARCH_PAGE } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_SEARCH_ATTRIBUTES } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Form from '@Components/Components/Forms'
import Buttons from '../Components/Buttons'
import SearchFields from '@/Pages/Search/Pages/Components/SearchFields'
import styled from 'styled-components'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import Table from '@/Pages/Search/Pages/Components/Table'
import SearchOperator from '@/Pages/Search/Pages/Components/SearchOperator'
import Title from '@/Pages/Search/Pages/Documents/Components/Title'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'

export const Cont = styled(Form)`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
  align-items: flex-start;
  width: 100%;
  grid-template-columns: 3fr 1fr 1fr;
`

const Documents = () => {
  const api = useContext(ApiContext)
  const [operator, setOperator] = useState(() => new Map())
  const getNotification = useOpenNotification()
  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const {
    tabState,
    setTabState,
    tabState: { value = 'ddt_startup_complex_type_doc' },
  } = tabItemState

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SEARCH_ATTRIBUTES, {
        type: value,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, value])

  const onInput = useCallback((value) => setTabState({ value }), [setTabState])

  useAutoReload(loadData, tabItemState)

  return (
    <TabStateContext.Provider
      value={{
        tabState,
        setTabState,
        value,
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

export default Documents
