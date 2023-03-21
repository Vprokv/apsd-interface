import React, { useCallback, useContext, useState } from 'react'
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
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { TextArea } from '@Components/Components/Inputs/TextArea'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import {ShowAnswerButtonContext, UpdateContext} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'

const CreateAnswer = ({ remarkText, remarkId }) => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [open, setOpenState] = useState(false)
  const update = useContext(UpdateContext)
  const { answer } = useContext(ShowAnswerButtonContext)
  const [filter, setFilterValue] = useState({ remarkText })
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)

  const rules = {
    solutionId: [{ name: VALIDATION_RULE_REQUIRED }],
    text: [{ name: VALIDATION_RULE_REQUIRED }],
  }

  const fields = [
    {
      id: 'remarkText',
      component: CustomInput,
      placeholder: 'Введите текст замечания',
      label: 'Текст замечания',
      disabled: true,
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
  ]

  const onSave = useCallback(async () => {
    // eslint-disable-next-line no-unused-vars
    const { remarkText, ...other } = filter
    await api.post(URL_REMARK_ANSWER, {
      documentId: id,
      memberId: r_object_id,
      memberName: dss_user_name,
      remarkId,
      ...other,
    })
    update()
    changeModalState(false)()
  }, [
    api,
    changeModalState,
    dss_user_name,
    filter,
    id,
    r_object_id,
    remarkId,
    update,
  ])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue({ remarkText })
  }, [changeModalState, remarkText])

  return (
    <div>
      <SecondaryBlueButton disabled={!answer} onClick={changeModalState(true)}>
        Ответить
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Добавить ответ"
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
            />
            <LinkNdt links={filter} setLinks={setFilterValue} />
          </div>
        </div>
        <UnderButtons leftFunc={onClose} rightFunc={onSave} />
      </StandardSizeModalWindow>
    </div>
  )
}

CreateAnswer.propTypes = {}

export default CreateAnswer
