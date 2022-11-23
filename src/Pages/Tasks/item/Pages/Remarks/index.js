import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_APPROVAL_SHEET, URL_REMARK_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import PostponeIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/Postpone'
import OtherIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/Other'
import ScrollBar from '@Components/Components/ScrollBar'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import angleIcon from '@/Icons/angleIcon'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import CreateRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import XlsIcon from '@/Icons/XlsIcon'
import ExportIcon from '@/Icons/ExportIcon'
import RowComponent from '@/Pages/Tasks/item/Pages/Remarks/Components/RowComponent'
import { Button } from '@Components/Components/Button'
import editIcon from '@/Icons/editIcon'
import deleteIcon from '@/Icons/deleteIcon'

const mockData = [
  {
    remarkId: 'string', //- id замечания
    number: '30', //- номер
    stageName: 'Согласование куратора ИА - 4 этап', //- наименование этапа
    stageStatus: 'Разослано', //- статус этапа
    remarkMemberFullName: 'Корнейчук Р.П.', //- Кто оставил замечание
    remarkMemberPosition: 'Руководитель проекта', //- должность
    status: 'Принято', //- статус замечания или ответа
    remarkText: 'Градостроительный кодекс РФ от 18.12.2021', //- текст замечания
    remarkCreationDate: 'date', //- дата создания замечания
    remarkType: 'Внутреннее', //- тип замечания (наименование)
    setRemark: 'Не включено в свод', //- свод замечаний
    answerMemberFullName: 'Пилипчук Р.П.', //- кто ответил на замечание
    answerMemberPosition: 'Начальник службы', //- должность
    answerText: 'string', //- текст ответа
    answerCreationDate: 'string', //- дата ответа
    ndtLinks: [
      //- ссылки на НДТ
      {
        id: 'string', //- id из справочника
        name: 'name', //- наименование из справочника
        comment: 'string', // - коммент к ссылке
      },
    ],
  },
]

const Remarks = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [filter, setFilterValue] = useState({})

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [], change },
  } = tabItemState

  console.log(data, 'data')

  const setChange = useCallback(() => {
    const { change } = tabState

    return change
      ? setTabState({ change: !change })
      : setTabState({ change: true })
  }, [setTabState, tabState])

  const loadData = useCallback(async () => {
    // const { data } = await api.post(URL_REMARK_LIST, {
    //   documentId: id,
    //   filter,
    // })

    // return data
    return mockData
  }, [api, id, type, change])

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: 'statusId',
        component: LoadableSelect,
        placeholder: 'Статус',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        // loadFunction: async () => {
        //   const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
        //   return data
        // },
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

  const onDelete = useCallback(() => null, [])

  return (
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
          <CreateRemark />
          <ButtonForIcon className="ml-2 color-text-secondary">
            <Icon icon={ExportIcon} />
          </ButtonForIcon>
        </div>
      </div>
      {data.map((val, key) => (
        <RowComponent key={key} {...val}>
          <div className="flex h-full items-center">
            <div className="mr-12 font-medium">{val?.stageName}</div>
            <div className="mr-12 w-24">{val?.stageStatus}</div>
            <div className="flex items-center ml-auto">
              <Button className="color-blue-1">
                <Icon icon={editIcon} />
              </Button>
              <LoadableBaseButton onClick={onDelete} className="color-blue-1">
                <Icon icon={deleteIcon} />
              </LoadableBaseButton>
            </div>
          </div>
        </RowComponent>
      ))}
    </div>
  )
}

Remarks.propTypes = {}

export default Remarks
