import React from 'react'
import PropTypes from 'prop-types'
import Titles from '@/Pages/Search/Pages/Components/Titles'
import SearchFields from '@/Pages/Search/Pages/Components/SearchFields'
import CheckBoxes from '@/Pages/Search/Pages/Components/CheckBox'
import Buttons from '@/Pages/Search/Pages/Components/Buttons'
import { Cont } from '@/Pages/Search/Pages/Documents'
import useTabItem from '@apsd/components/Logic/Tab/TabItem'
import { SEARCH_PAGE } from '@/contants'
import { TabStateContext } from '@/Pages/Search/Pages/constans'

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

const Tasks = (props) => {
  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const {
    tabState,
    setTabState,
    tabState: { data = pageData, searchValues = [] },
  } = tabItemState

  return (
    <TabStateContext.Provider value={{ tabState, setTabState }}>
      <Cont>
        <Titles data={data} />
        <SearchFields data={data} />
        <CheckBoxes data={data} />
        <Buttons />
      </Cont>
    </TabStateContext.Provider>
  )
}

Tasks.propTypes = {}

export default Tasks
