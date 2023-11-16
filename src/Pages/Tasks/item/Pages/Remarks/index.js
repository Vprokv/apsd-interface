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
  SetAnswerStateContext,
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
import Loading from '../../../../../Components/Loading'
import CreateAnswer from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer'

const WithToggle = ToggleNavigationItemWrapper(WithToggleNavigationItem)

const Remarks = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({ allStages: true })
  const [toggle, onToggle] = useState({})
  const [open, setOpen] = useState(true)
  const getNotification = useOpenNotification()
  const [sortQuery, onSort] = useState({
    key: 'remarkCreationDate',
    direction: 'ASC',
  })
  const [selected, setSelected] = useState()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })
  const {
    tabState: { data: { stages = [], tabPermit } = {}, loading },
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
        sort: [
          {
            direction: sortQuery.direction,
            property: sortQuery.key,
          },
        ],
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, id, filter, sortQuery, getNotification])

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
    <SetAnswerStateContext.Provider value={setSelected}>
      <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
        <div className="flex items-center py-4 form-element-sizes-32 justify-between">
          <FilterForm
            className="mr-2"
            value={filter}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div>
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
        <div className="flex items-center ml-auto mb-4">
          <CreateRemark tabPermit={tabPermit} />
          <SecondaryBlueButton className="ml-2">
            Выгрузить свод замечаний
          </SecondaryBlueButton>
        </div>
        {loading ? (
          <Loading />
        ) : (
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
        )}
        <CreateAnswer {...selected} setSelected={setSelected}/>
      </div>
    </SetAnswerStateContext.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
