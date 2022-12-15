import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_APPROVAL_SHEET,
  URL_ENTITY_LIST,
  URL_REMARK_DELETE,
  URL_REMARK_LIST,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import CreateRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import ExportIcon from '@/Icons/ExportIcon'
import RowComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent'
import deleteIcon from '@/Icons/deleteIcon'
import EditRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/EditRemark'
import { UpdateContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'

const Remarks = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change },
  } = tabItemState

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_REMARK_LIST, {
      documentId: id,
      filter,
    })

    return data
  }, [api, id, type, filter, change])

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: 'statusId',
        component: LoadableSelect,
        placeholder: 'Статус',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_status_remark',
          })
          return data
        },
      },
      {
        id: 'authorId',
        component: UserSelect,
        placeholder: 'Выберите автора',
      },
      {
        id: 'remarkText',
        component: SearchInput,
        placeholder: 'Введите замечание',
      },
    ],
    [api],
  )

  const onDelete = useCallback(async () => {
    await api.post(URL_REMARK_DELETE, {
      remarkIds: selectState,
    })
    setChange()
  }, [api, selectState, setChange])

  return (
    <UpdateContext.Provider value={setChange}>
      <div className="px-4 pb-4  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <FilterForm
            className="mr-2"
            value={filter}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <CreateRemark />
            <ButtonForIcon className="ml-2 color-text-secondary">
              <Icon icon={ExportIcon} />
            </ButtonForIcon>
          </div>
        </div>
        <div className="flex flex-col">
          {data.map((val, key) => {
            if (val) {
              return (
                <RowComponent
                  key={key}
                  selectState={selectState}
                  setSelectState={setSelectState}
                  {...val}
                >
                  <div className="flex items-center">
                    <div className="mr-12 font-medium">{val?.stageName}</div>
                    <div className="mr-12 w-24">{val?.stageStatus}</div>
                    <div className="flex items-center ml-auto">
                      <EditRemark {...val} />
                      <LoadableBaseButton
                        onClick={onDelete}
                        className="color-blue-1"
                      >
                        <Icon icon={deleteIcon} />
                      </LoadableBaseButton>
                    </div>
                  </div>
                </RowComponent>
              )
            }
          })}
        </div>
      </div>
    </UpdateContext.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
