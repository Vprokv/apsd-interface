import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { ApiContext } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { FilterForm } from './styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import {
  URL_ENTITY_LIST,
  URL_REMARK_ANSWER,
  URL_REMARK_CREATE,
} from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useParams } from 'react-router-dom'
import InputWrapper, {
  InputLabel,
  InputLabelStart,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { TextArea } from '@Components/Components/Inputs/TextArea'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import {
  ShowAnswerButtonContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { returnChildren } from '@Components/Components/Forms'
import { NdtLinkWrapper } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'

const rules = {
  solutionId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [{ name: VALIDATION_RULE_REQUIRED }],
  member: [{ name: VALIDATION_RULE_REQUIRED }],
}

const CreateAnswer = ({
  remarkText,
  remarkId,
  permits: { edit, editAuthor },
}) => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [open, setOpenState] = useState(false)
  const update = useContext(UpdateContext)
  const getNotification = useOpenNotification()
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const {
    r_object_id,
    dss_user_name,
    dss_last_name,
    dss_first_name,
    dss_middle_name,
    department_name,
    position_name,
  } = useRecoilValue(userAtom)

  const initialUserValue = useMemo(() => {
    return {
      remarkText,
      member: {
        emplId: r_object_id,
        fullDescription: `${dss_last_name} ${dss_first_name},${dss_middle_name}, ${position_name}, ${department_name}`,
        userName: dss_user_name,
      },
    }
  }, [
    department_name,
    dss_first_name,
    dss_last_name,
    dss_middle_name,
    dss_user_name,
    position_name,
    r_object_id,
    remarkText,
  ])

  const [filter, setFilterValue] = useState(initialUserValue)

  const fields = [
    {
      id: 'remarkText',
      component: CustomInput,
      placeholder: 'Введите текст замечания',
      label: 'Текст замечания',
      disabled: true,
    },
    {
      id: 'member',
      label: 'Автор',
      disabled: !editAuthor,
      returnOption: true,
      returnObjects: true,
      options: [initialUserValue.member],
      component: UserSelect,
    },
    {
      id: 'solutionId',
      component: LoadableSelect,
      placeholder: 'Выберите тип',
      isRequired: false,
      label: 'Решение',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_status_solution',
          query,
        })
        return data
      },
    },
    {
      id: 'text',
      label: 'Текст ответа',
      isRequired: true,
      className: '',
      component: CustomInput,
      placeholder: 'Введите текст ответа',
    },
    {
      id: 'ndtLinks',
      label: 'Ссылка нa НДТ',
      component: LinkNdt,
      placeholder: 'Выберите значение',
      inputWrapper: returnChildren,
      InputUiContext: NdtLinkWrapper,
    },
  ]

  const customMessagesFuncMap = {
    ...defaultFunctionsMap,
    200: () => {
      return {
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Ответ на замечание добавлен успешно',
      }
    },
  }

  const onSave = useCallback(async () => {
    // eslint-disable-next-line no-unused-vars
    try {
      const { remarkText, member, ...other } = filter
      const { status } = await api.post(URL_REMARK_ANSWER, {
        documentId: id,
        memberId: member.emplId,
        memberName: member.userName,
        remarkId,
        ...other,
      })
      update()
      getNotification(customMessagesFuncMap[status]())
      changeModalState(false)()
      setFilterValue(initialUserValue)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    changeModalState,
    customMessagesFuncMap,
    filter,
    getNotification,
    id,
    initialUserValue,
    remarkId,
    update,
  ])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue(initialUserValue)
  }, [changeModalState, initialUserValue])

  return (
    <div>
      <SecondaryBlueButton disabled={!edit} onClick={changeModalState(true)}>
        Ответить
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Добавить ответ на замечание"
        open={open}
        onClose={onClose}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex flex-col py-4">
            <FilterForm
              className="form-element-sizes-40"
              fields={fields}
              value={filter}
              onInput={setFilterValue}
              inputWrapper={InputWrapper}
              rules={rules}
              onSubmit={onSave}
            >
              <div className="mt-10">
                <UnderButtons leftFunc={onClose} />
              </div>
            </FilterForm>
          </div>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateAnswer.propTypes = {}

export default CreateAnswer
