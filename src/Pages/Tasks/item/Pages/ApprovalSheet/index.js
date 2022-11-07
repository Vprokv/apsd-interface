import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_APPROVAL_SHEET } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import LoadableSelect from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon } from '@/Components/Button'
import OtherIcon from './Components/icons/Other'
import PostponeIcon from './Components/icons/Postpone'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import {
  LoadContext,
  TypeContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'

const ApprovalSheet = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [filterValue, setFilterValue] = useState({})

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change = true },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_APPROVAL_SHEET, {
      id,
      type,
    })

    return data
  }, [api, id, type, change])

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: LoadableSelect,
        placeholder: 'Ждать первой визы',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
      },
      {
        id: 'query',
        component: SearchInput,
        placeholder: 'Период доработки',
      },
    ],
    [],
  )

  return (
    <LoadContext.Provider value={setChange}>
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <FilterForm
            className="mr-2"
            value={filterValue}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <ButtonForIcon className="mr-2 color-text-secondary">
              <Icon icon={PostponeIcon} />
            </ButtonForIcon>
            <ButtonForIcon className="color-text-secondary">
              <Icon icon={OtherIcon} />
            </ButtonForIcon>
          </div>
        </div>
        <ScrollBar>
          {data.map(({ stages, type }, key) => (
            <TypeContext.Provider key={key} value={type}>
              <Tree
                key={key}
                defaultExpandAll={true}
                valueKey="id"
                options={stages}
                rowComponent={RowSelector}
                onUpdateOptions={() => null}
                childrenKey="approvers"
              />
            </TypeContext.Provider>
          ))}
        </ScrollBar>
      </div>
    </LoadContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
