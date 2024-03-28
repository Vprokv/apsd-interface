import { useCallback, useContext, useState } from 'react'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import Icon from '@Components/Components/Icon'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import {
  URL_ADDITIONAL_AGREEMENT_USER_LIST,
  URL_APPROVAL_CREATE,
} from '@/ApiList'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Form from '@Components/Components/Forms'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Tips from '@/Components/Tips'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'
import SetUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Пользователь добавлен успешно',
    }
  },
}

const rules = {}

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 41.6%;
  margin: auto;
  z-index: 10;
`

const AddUserWindow = ({
  stageId,
  documentId,
  stageType,
  stageCurator = false,
}) => {
  const [open, setOpenState] = useState(false)
  const [filter, setFilter] = useState({})
  const getNotification = useOpenNotification()
  const permit = useContext(PermitDisableContext)
  const api = useContext(ApiContext)

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const fieldMap = [
    {
      id: 'user',
      label: 'Участник этапа',
      component: AdditionalAgreementOrgStructureComponent,
      loadFunction: (api) => (filter) => async (query) => {
        const { data } = await api.post(URL_ADDITIONAL_AGREEMENT_USER_LIST, {
          stageId,
          stageCurator,
          documentId,
          filter: {
            ...filter,
            ...query,
          },
        })
        return data
      },
      placeholder: 'Выберите участников',
      multiple: true,
    },
  ]

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_APPROVAL_CREATE, {
        stageId,
        documentId,
        stageType,
        performers: filter.user,
      })
      setTabState(SetUnFetchedState())
      getNotification(customMessagesFuncMap[response.status]())
      changeModalState(false)()
    } catch (e) {
      const { response: { status = 500, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    stageId,
    documentId,
    stageType,
    filter.user,
    setTabState,
    getNotification,
    changeModalState,
  ])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilter({})
  }, [changeModalState])

  return (
    <div className="h-full">
      <Tips text="Добавить согласующего">
        <CustomButtonForIcon
          className="color-blue-1"
          onClick={changeModalState(true)}
          disabled={permit}
        >
          <Icon icon={AddUserIcon} />
        </CustomButtonForIcon>
      </Tips>
      <StandardSizeModalWindow
        title="Добавить согласующего"
        open={open}
        onClose={onClose}
      >
        <Form
          className="mb-10"
          inputWrapper={InputWrapper}
          value={filter}
          onInput={setFilter}
          fields={fieldMap}
          rules={rules}
        />
        <UnderButtons
          className="mt-auto"
          leftFunc={onClose}
          rightFunc={onSave}
          leftLabel="Закрыть"
          rightLabel="Сохранить"
        />
      </StandardSizeModalWindow>
    </div>
  )
}

export default AddUserWindow
