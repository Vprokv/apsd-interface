import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Titles from '@/Pages/Search/Pages/Components/Titles'
import SearchFields from '@/Pages/Search/Pages/Components/SearchFields'
import CheckBoxes from '@/Pages/Search/Pages/Components/CheckBox'
import Buttons from '@/Pages/Search/Pages/Components/Buttons'
import { Cont } from '@/Pages/Search/Pages/Documents'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE, SEARCH_PAGE_TASKS } from '@/contants'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import Table from '@/Pages/Search/Pages/Components/Table'
import useButtonFunc from '@/Pages/Search/Pages/useButtonFunc'
import { URL_SEARCH_ATTRIBUTES } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { useParams } from 'react-router-dom'
import SearchOperator from "@/Pages/Search/Pages/Components/SearchOperator";

const pageData = [
  {
    dss_attr_name: 'dss_reg_number',
    dss_attr_label: 'Автор',
    dss_component_type: 'UserSelect',
    multiple: false,
  },
  {
    dss_attr_name: 'dss_date-reg',
    dss_attr_label: 'Дата регистрации',
    range: true,
    dss_component_type: 'Date',
    multiple: false,
  },
  {
    dss_attr_name: 'dss_name',
    dss_attr_label: 'Наименование',
    dss_component_type: 'Text',
    multiple: false,
  },
  {
    dss_attr_name: 'dsid_signer_empl',
    dss_attr_label: 'Подписант',
    dss_component_type: 'UserSelect',
    multiple: false,
  },
  {
    dss_attr_name: 'dsid_state',
    dss_attr_label: 'Состояние',
    dss_component_type: 'Combobox',
    dss_component_reference: 'ddt_state',
    multiple: false,
  },
  {
    dss_attr_name: 'dss_reg_number',
    dss_attr_label: 'Шифр/Рег. номер',
    dss_component_type: 'Text',
    multiple: false,
  },
]

const Tasks = () => {
  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE_TASKS,
  })

  const { tabState, setTabState } = tabItemState
  const [checked, setChecked] = useState(() => new Map())

  const loadData = useCallback(async () => {
    return pageData
  }, [])

  useAutoReload(loadData, tabItemState)

  const getButtonFunc = useButtonFunc({
    tabState,
    setTabState,
  })

  return (
    <TabStateContext.Provider
      value={{ tabState, setTabState, getButtonFunc, checked, setChecked }}
    >
      <div className="flex flex-col">
        <Cont>
          <Titles />
          <SearchFields />
          <SearchOperator />
          <Buttons />
        </Cont>
        <Table />
      </div>
    </TabStateContext.Provider>
  )
}

Tasks.propTypes = {}

export default Tasks