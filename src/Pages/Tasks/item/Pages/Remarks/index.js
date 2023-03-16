import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_APPROVAL_SHEET,
  URL_DOCUMENT_CREATION_OPTIONS,
  URL_ENTITY_LIST,
  URL_REMARK_DELETE,
  URL_REMARK_LIST,
  URL_REMARK_PERMIT,
} from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import {
  ButtonForIcon,
  LoadableBaseButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import CreateRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import ExportIcon from '@/Icons/ExportIcon'
import RowComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent'
import deleteIcon from '@/Icons/deleteIcon'
import EditRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/EditRemark'
import {
  ShowAnswerButtonContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import CheckBox from '@/Components/Inputs/CheckBox'

const Remarks = (props) => {
  const { type } = useParams()
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], permit, change },
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

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_REMARK_PERMIT, {
        documentId: id,
      })

      setTabState({ permit: data })
    })()
  }, [api, filter, id, setTabState])

  const fields = useMemo(
    () => [
      {
        id: 'statusId',
        component: LoadableSelect,
        placeholder: 'Статус',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_status_remark',
            query,
          })
          return data
        },
      },
      {
        id: 'type',
        component: LoadableSelect,
        placeholder: 'Выберите тип',
        valueKey: 'r_object_id',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_type_remark',
            query,
          })
          return data
        },
        labelKey: 'dss_name',
      },
      {
        id: 'allIteration',
        component: CheckBox,
        text: 'Все итерации',
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
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32">
          <FilterForm
            className="mr-2"
            value={filter}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <CreateRemark disabled={permit?.remarkCreate} />
            <SecondaryBlueButton className="ml-2">
              Выгрузить свод замечаний
            </SecondaryBlueButton>
            <ButtonForIcon className="ml-2 color-text-secondary">
              <Icon icon={ExportIcon} />
            </ButtonForIcon>
          </div>
        </div>
        <div className="flex flex-col">
          <ShowAnswerButtonContext.Provider value={permit?.answer}>
            {data.map((val, key) => {
              // if (val) {
              return (
                <RowComponent
                  key={key}
                  selectState={selectState}
                  setSelectState={setSelectState}
                  {...val}
                >
                  <div className="flex items-center">
                    <div className="ml-4 font-medium">{val?.stageName}</div>
                    <div className="flex items-center ml-auto">
                      <EditRemark disabled={permit?.edit} {...val} />
                      <LoadableBaseButton
                        disabled={permit?.delete}
                        onClick={onDelete}
                        className="color-blue-1"
                      >
                        <Icon icon={deleteIcon} />
                      </LoadableBaseButton>
                    </div>
                  </div>
                </RowComponent>
              )
              // }
            })}
          </ShowAnswerButtonContext.Provider>
        </div>
      </div>
    </UpdateContext.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
