import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ApiContext, TASK_ITEM_REMARKS, TokenContext } from '@/contants'
import { useAutoReload, useTabItem } from '@Components/Logic/Tab'
import {
  URL_ENTITY_LIST,
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_REMARK_EDIT_SET_REMARK,
  URL_REMARK_LIST,
} from '@/ApiList'
import LoadableSelect from '@/Components/Inputs/Select'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, LoadableSecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import CreateRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import {
  exportColumnConfig,
  onOpenModalComponent,
  OnSetRemarkActionContext,
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
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'

const WithToggle = ToggleNavigationItemWrapper(WithToggleNavigationItem)

const defaultSortQuery = {
  key: 'remarkCreationDate',
  direction: 'ASC',
}

const defaultFilter = { allStages: true, allIteration: true }

const Remarks = () => {
  const [ModalComponent, setModalComponent] = useState()
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [toggle, onToggle] = useState({})
  const [open, setOpen] = useState(true)
  const getNotification = useOpenNotification()
  const [selected, setSelected] = useState()
  const { token } = useContext(TokenContext)

  const [
    { sortQuery = defaultSortQuery, filter = defaultFilter, ...tabState },
    setTabState,
  ] = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_REMARK_LIST, {
        documentId: id,
        filter: {
          ...filter,
          isApprove: false,
        },
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

  const [{ data: { stages = [], tabPermit } = {}, loading }, updateData] =
    useAutoReload(loadData, tabState, setTabState)

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

  const onExportRemarks = useCallback(async () => {
    try {
      const {
        data: { id: fileId },
      } = await api.post(URL_EXPORT, {
        url: `${API_URL}/apsd/remark/exportList`,
        label: 'Свод замечаний',
        sheetName: 'Выгрузка данных',
        exportType: 'remarks',
        columns: exportColumnConfig,
        body: {
          documentId: id,
          sort: [
            {
              direction: sortQuery.direction,
              property: sortQuery.key,
            },
          ],
          token,
        },
      })

      const { data } = await api.get(`${URL_EXPORT_FILE}${fileId}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, 'Замечания.xlsx')
    } catch (e) {
      const { response: { status = '0', data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, getNotification, id, sortQuery.direction, sortQuery.key, token])

  const onSetRemark = useCallback(
    ({ remarkIds, vault }) =>
      async () => {
        try {
          const { status } = await api.post(URL_REMARK_EDIT_SET_REMARK, {
            remarkIds,
            vault,
          })
          updateData(await loadData())
          getNotification(defaultFunctionsMap[status]())
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      },
    [api, getNotification, loadData, updateData],
  )

  return (
    <onOpenModalComponent.Provider value={setModalComponent}>
      <SetAnswerStateContext.Provider value={setSelected}>
        <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
          <div className="flex items-center  py-4 justify-between">
            <FilterForm
              className="mr-2"
              value={filter}
              onInput={useCallback(
                (filter) => setTabState({ filter }),
                [setTabState],
              )}
              fields={fields}
              inputWrapper={EmptyInputWrapper}
            />
            <div className="flex items-center ml-auto">
              <CreateRemark tabPermit={tabPermit} />
              <LoadableSecondaryBlueButton
                className="ml-2"
                onClick={onExportRemarks}
              >
                Выгрузить свод замечаний
              </LoadableSecondaryBlueButton>
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
          {loading ? (
            <Loading />
          ) : (
            <ScrollBar>
              <div className="flex flex-col">
                <OnSetRemarkActionContext.Provider value={onSetRemark}>
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
                </OnSetRemarkActionContext.Provider>
              </div>
            </ScrollBar>
          )}
          <CreateAnswer {...selected} setSelected={setSelected} />
          {ModalComponent && (
            <ModalComponent onClose={() => setModalComponent()} />
          )}
        </div>
      </SetAnswerStateContext.Provider>
    </onOpenModalComponent.Provider>
  )
}

Remarks.propTypes = {}

export default Remarks
