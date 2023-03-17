import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { ApiContext } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { CustomInput, FilterForm } from './styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { URL_ENTITY_LIST, URL_REMARK_CREATE } from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useParams } from 'react-router-dom'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { UpdateContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_SAME,
} from '@Components/Logic/Validator/constants'

const rules = {
  author: [{ name: VALIDATION_RULE_REQUIRED }],
  remarkTypeId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [{ name: VALIDATION_RULE_REQUIRED }],
}

const CreateRemark = ({ disabled }) => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [open, setOpenState] = useState(false)
  const update = useContext(UpdateContext)
  const [filter, setFilterValue] = useState({})
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)

  const fields = [
    {
      id: 'author',
      label: 'Автор',
      component: UserSelect,
    },
    {
      id: 'remarkTypeId',
      component: LoadableSelect,
      placeholder: 'Выберите тип',
      label: 'Тип замечания',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_type_remark',
          query,
        })
        return data
      },
    },
    {
      id: 'text',
      label: 'Текст замечания',
      component: CustomInput,
      placeholder: 'Введите текст замечания',
    },
  ]

  const onSave = useCallback(async () => {
    await api.post(URL_REMARK_CREATE, {
      documentId: id,
      memberId: r_object_id,
      memberName: dss_user_name,
      ...filter,
    })
    update()
    changeModalState(false)()
  }, [api, dss_user_name, filter, id, r_object_id])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue({})
  }, [changeModalState])

  return (
    <div>
      <SecondaryBlueButton
        disabled={!disabled}
        onClick={changeModalState(true)}
      >
        Добавить замечание
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Добавить замечание"
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
              rules={rules}
              inputWrapper={InputWrapper}
            />
            <div className="flex w-full">
              <LinkNdt links={filter} setLinks={setFilterValue} />
            </div>
          </div>
        </div>
        <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-64">
          Импорт значений
        </SecondaryBlueButton>
        <SecondaryBlueButton className="ml-4 form-element-sizes-32 w-64 mt-2">
          Скачать шаблон таблицы
        </SecondaryBlueButton>
        <UnderButtons leftFunc={onClose} rightFunc={onSave} />
      </StandardSizeModalWindow>
    </div>
  )
}

CreateRemark.propTypes = {}

export default CreateRemark
