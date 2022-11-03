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
import CreateApprovalSheetWindow from './Components/CreateApprovalSheetWindow'
import Tree from '@Components/Components/Tree'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import ScrollBar from '@Components/Components/ScrollBar'

const myData = [
  {
    type: 'string', //- системное наименование корневого этапа
    name: 'string', //- наименование корневого этапа
    canAdd: false,
    hasAutoAgreement: false,
    current: false,
    addGroup: false,
    emplOrAgents: null,
    stages: [], //- этапы конфигурируемые пользователем
  },
  {
    type: 'string',
    name: 'string',
    canAdd: true,
    hasAutoAgreement: true,
    current: false,
    addGroup: false,
    emplOrAgents: null,
    stages: [
      {
        id: 'string', //- id этапа
        globalId: 'string',
        documentId: 'string', //- id документа к которому относиться этап
        index: 1, //- номер этапа
        name: 'string', //- наименование этапа
        iteration: 0,
        status: 'string', //- статус этапа
        approvers: [
          {
            id: 'string', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
        ],
        editable: true,
        changePerformersPermit: false,
        changeTermPermit: false,
        deletable: true,
        appendBefore: true,
        appendAfter: true,
        autoApprove: true,
        fixedApprovalPeriod: true,
        increasedTerm: false,
        stageType: 'string', //- тип этапа
        term: 4, //- кол-во раб дней на этап
        endDate: null,
        finishDate: null,
        creator: 'Delova',
      },
      {
        id: 'sdsdsds', //- id этапа
        globalId: 'string',
        documentId: 'string', //- id документа к которому относиться этап
        index: 2, //- номер этапа
        name: 'name 2', //- наименование этапа
        iteration: 0,
        status: 'string', //- статус этапа
        approvers: [
          {
            id: '11', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
          {
            id: '22', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
        ],
        editable: true,
        changePerformersPermit: false,
        changeTermPermit: false,
        deletable: true,
        appendBefore: true,
        appendAfter: true,
        autoApprove: true,
        fixedApprovalPeriod: true,
        increasedTerm: false,
        stageType: 'string', //- тип этапа
        term: 2, //- кол-во раб дней на этап
        endDate: null,
        finishDate: null,
        creator: 'Delova',
      },
    ],
  },
  {
    type: 'string',
    name: 'string',
    canAdd: true,
    hasAutoAgreement: true,
    current: false,
    addGroup: false,
    emplOrAgents: null,
    stages: [
      {
        id: 'string', //- id этапа
        globalId: 'string',
        documentId: 'string', //- id документа к которому относиться этап
        index: 1, //- номер этапа
        name: 'string', //- наименование этапа
        iteration: 0,
        status: 'string', //- статус этапа
        approvers: [
          {
            id: 'string', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
        ],
        editable: true,
        changePerformersPermit: false,
        changeTermPermit: false,
        deletable: true,
        appendBefore: true,
        appendAfter: true,
        autoApprove: true,
        fixedApprovalPeriod: true,
        increasedTerm: false,
        stageType: 'string', //- тип этапа
        term: 4, //- кол-во раб дней на этап
        endDate: null,
        finishDate: null,
        creator: 'Delova',
      },
      {
        id: 'sdsdsds', //- id этапа
        globalId: 'string',
        documentId: 'string', //- id документа к которому относиться этап
        index: 2, //- номер этапа
        name: 'name 2', //- наименование этапа
        iteration: 0,
        status: 'string', //- статус этапа
        approvers: [
          {
            id: '11', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
          {
            id: '22', //- id записи с участником этапа
            creatorName: 'string',
            dsidStage: 'string', //- id этапа к которому относится участник
            dsidDocument: 'string', //- id документа
            dssApproverName: 'string', // - логин участника
            dsidApproverEmpl: 'string', //- id участника
            dssStatus: 'string', // - статус участника
            performerComment: null,
            dssApproverFio: 'Автотест1 А Т', //- данные участника для вывода на экран
            dssApproverPosition: 'Сотрудник',
            dssApproverDep: 'Департамент 1',
            dssApproverBranch: 'Тестовый филиал ФСК',
            dssApproverOrganization: 'ПАО ФСК ЕЭС',
            dsdtInit: null,
            dsdtDueDate: null,
            dsdtDecision: null,
            dsdtAcquire: null,
            dsbAdditional: false,
            dsidParentApprover: null,
            dsidApproverRoot: '00000002000372ve',
            approvers: null,
            deletable: true,
            isFederated: false,
            canDistribute: false,
            canRecall: false,
            canCreateChat: false,
            report: null,
            reportsCount: 0,
            statusName: 'new',
            agentPerson: null,
            delegate: null,
            deputy: null,
            dssGroupName: null,
          },
        ],
        editable: true,
        changePerformersPermit: false,
        changeTermPermit: false,
        deletable: true,
        appendBefore: true,
        appendAfter: true,
        autoApprove: true,
        fixedApprovalPeriod: true,
        increasedTerm: false,
        stageType: 'string', //- тип этапа
        term: 2, //- кол-во раб дней на этап
        endDate: null,
        finishDate: null,
        creator: 'Delova',
      },
    ],
  },
]

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
    tabState: { data = myData },
  } = tabItemState

  console.log(data, 'data')

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_APPROVAL_SHEET, {
      id,
      type,
    })

    return data
  }, [api, id, type])

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
    <LoadContext.Provider value={loadData}>
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
            <CreateApprovalSheetWindow loadData={loadData} />
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
            <Tree
              key={key}
              defaultExpandAll={true}
              valueKey="id"
              options={stages}
              rowComponent={RowSelector}
              onUpdateOptions={() => null}
              childrenKey="approvers"
            />
          ))}
        </ScrollBar>
      </div>
    </LoadContext.Provider>
  )
}

ApprovalSheet.propTypes = {}

export default ApprovalSheet
