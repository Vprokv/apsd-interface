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
import {
  ShowAnswerButtonContext,
  ToggleContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import CheckBox from '@/Components/Inputs/CheckBox'
import ToggleNavigationItemWrapper, {
  WithToggleNavigationItem,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/WithToggleNavigationItem'
import SortIcon from '@/Pages/Tasks/item/Pages/Contain/Icons/SortIcon'
import ScrollBar from '@Components/Components/ScrollBar'
import Tips from '@/Components/Tips'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import IterationComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/Iteration'

const WithToggle = ToggleNavigationItemWrapper(WithToggleNavigationItem)

const Remarks = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({ allStages: true })
  const [toggle, onToggle] = useState({})
  const [open, setOpen] = useState(true)
  const getNotification = useOpenNotification()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })
  const {
    tabState: { data: { stages = [], tabPermit } = {} },
  } = tabItemState

  useEffect(() => {
    return (
      !toggle.size &&
      stages.forEach(({ stageName }) => {
        onToggle((map) => {
          return { ...map, [stageName]: false }
        })
      })
    )
  }, [stages, toggle.size])

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_REMARK_LIST, {
        documentId: id,
        filter,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, id, filter, getNotification])

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
      {
        id: 'allStages',
        component: CheckBox,
        text: 'Все этапы',
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
              {stages.map((val) => (
                <WithToggle key={val.stageName} id={val.stageName}>
                  {({ isDisplayed, toggleDisplayedFlag }) => {
                    return (
                      <IterationComponent
                        isDisplayed={isDisplayed}
                        toggleDisplayedFlag={toggleDisplayedFlag}
                        {...val}
                      />
                    )
                  }}
                </WithToggle>
              ))}
            </ToggleContext.Provider>
          </div>
        </ScrollBar>
      </div>
    </ShowAnswerButtonContext.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
