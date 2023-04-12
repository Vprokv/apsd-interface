import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST, URL_REMARK_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import CreateRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import RowComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent'
import {
  ShowAnswerButtonContext,
  ToggleContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import CheckBox from '@/Components/Inputs/CheckBox'
import angleIcon from '@/Icons/angleIcon'
import ToggleNavigationItemWrapper, {
  WithToggleNavigationItem,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/WithToggleNavigationItem'
import SortIcon from '@/Pages/Tasks/item/Pages/Contain/Icons/SortIcon'
import ScrollBar from '@Components/Components/ScrollBar'
import Tips from '@/Components/Tips'

const WithToggle = ToggleNavigationItemWrapper(WithToggleNavigationItem)

const Remarks = (props) => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})
  const [selectState, setSelectState] = useState()
  const [toggle, onToggle] = useState({})
  const [open, setOpen] = useState(false)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })
  const {
    setTabState,
    tabState: { data: { remarks = [], tabPermit } = {} },
  } = tabItemState

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  useEffect(() => {
    return (
      !toggle.size &&
      remarks.forEach(({ remarkId }) => {
        onToggle((map) => {
          return { ...map, [remarkId]: true }
        })
      })
    )
  }, [remarks, toggle.size])

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_REMARK_LIST, {
      documentId: id,
      filter,
    })

    return data
  }, [api, id, filter])

  useAutoReload(loadData, tabItemState)

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
        id: 'typeId',
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

  const ChangeAllToggls = useCallback(() => {
    onToggle((prev) => {
      let newToggle = {}

      Object.keys(prev).forEach((key) => {
        newToggle[key] = open
      })

      return newToggle
    })

    setOpen((open) => !open)
  }, [open])

  return (
    <UpdateContext.Provider value={setChange}>
      <ShowAnswerButtonContext.Provider value={{}}>
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
              <CreateRemark tabPermit={tabPermit} />
              <SecondaryBlueButton className="ml-2">
                Выгрузить свод замечаний
              </SecondaryBlueButton>
              <Tips text={!open ? 'Свернуть все' : 'Развернуть все'}>
                <ButtonForIcon
                  onClick={ChangeAllToggls}
                  className="ml-2 color-text-secondary"
                >
                  <Icon icon={SortIcon} />
                </ButtonForIcon>
              </Tips>
            </div>
          </div>
          <ScrollBar>
            <div className="flex flex-col">
              <ToggleContext.Provider value={{ toggle, onToggle }}>
                {remarks.map((val) => (
                  <WithToggle key={val.remarkId} id={val.remarkId}>
                    {({ isDisplayed, toggleDisplayedFlag }) => {
                      return (
                        <RowComponent
                          isDisplayed={isDisplayed}
                          toggleDisplayedFlag={toggleDisplayedFlag}
                          key={val.remarkId}
                          selectState={selectState}
                          setSelectState={setSelectState}
                          {...val}
                        >
                          <div className="h-12 flex items-center">
                            <div className="pl-2">
                              <Icon
                                icon={angleIcon}
                                size={10}
                                className={`color-text-secondary ${
                                  isDisplayed ? '' : 'rotate-180'
                                }`}
                              />
                            </div>

                            <div className="ml-4 font-medium flex items-center ">
                              {val?.stageName}
                            </div>
                          </div>
                        </RowComponent>
                      )
                    }}
                  </WithToggle>
                ))}
              </ToggleContext.Provider>
            </div>
          </ScrollBar>
        </div>
      </ShowAnswerButtonContext.Provider>
    </UpdateContext.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
