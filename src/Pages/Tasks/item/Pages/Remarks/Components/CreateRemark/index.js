import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import { ApiContext } from '@/contants'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { CustomInput, FilterForm } from './styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { URL_ENTITY_LIST, URL_REMARK_CREATE } from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import InputWrapper, {
  InputLabel,
  InputLabelStart,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import {
  ShowAnswerButtonContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import UserSelect from '@/Components/Inputs/UserSelect'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import { WithValidationForm } from '@Components/Components/Forms'

const ScrollBar = styled(SimpleBar)`
  min-height: 400px;
`

const rules = {
  member: [{ name: VALIDATION_RULE_REQUIRED }],
  remarkTypeId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [{ name: VALIDATION_RULE_REQUIRED }],
  // nthLinks: [{ name: VALIDATION_RULE_REQUIRED }],
}

const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  min-height: 60.65%;
  margin: auto;
`

const CreateRemark = () => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const { editAuthor, createRemark } = useContext(ShowAnswerButtonContext)
  const [open, setOpenState] = useState(false)
  const update = useContext(UpdateContext)

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
      ndtLinks: [{}],
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
  ])

  const [filter, setFilterValue] = useState(initialUserValue)

  const fields = useMemo(
    () => [
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
      // {
      //   id: 'ndtLinks',
      //   label: 'Ссылка нa НДТ',
      //   component: (props) => (
      //     <LinkNdt {...props} value={filter.nthLinks} onInput={setFilterValue} />
      //   ),
      //   placeholder: 'Выберите значение',
      // },
    ],
    [api, editAuthor, initialUserValue],
  )

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onSave = useCallback(async () => {
    const { member, ...other } = filter
    await api.post(URL_REMARK_CREATE, {
      documentId: id,
      memberId: member.emplId,
      memberName: member.userName,
      ...other,
    })
    update()
    changeModalState(false)()
    setFilterValue(initialUserValue)
  }, [api, changeModalState, filter, id, initialUserValue, update])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue(initialUserValue)
  }, [changeModalState, initialUserValue])

  return (
    <div>
      <SecondaryBlueButton
        disabled={!createRemark}
        onClick={changeModalState(true)}
      >
        Добавить замечание
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        className="h-full"
        title="Добавить замечание"
        open={open}
        onClose={onClose}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <div className="flex flex-col py-4 h-full">
            <ScrollBar>
              <WithValidationForm
                className="form-element-sizes-40"
                fields={fields}
                value={filter}
                onInput={setFilterValue}
                rules={rules}
                inputWrapper={InputWrapper}
                onSubmit={onSave}
              >
                <div className="flex">
                  <InputLabel>
                    {'Ссылка нa НДТ'} {<InputLabelStart>*</InputLabelStart>}
                  </InputLabel>
                  <LinkNdt value={filter.ndtLinks} onInput={setFilterValue} />
                </div>
                <div className="mt-10">
                  <SecondaryBlueButton className="ml-4 form-element-sizes-40 w-64 mb-2">
                    Скачать шаблон таблицы
                  </SecondaryBlueButton>
                  <UnderButtons leftFunc={onClose}>
                    <SecondaryBlueButton className="ml-4 form-element-sizes-40 w-48 mr-auto">
                      Импорт значений
                    </SecondaryBlueButton>
                  </UnderButtons>
                </div>
              </WithValidationForm>
            </ScrollBar>
          </div>
        </div>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateRemark.propTypes = {}

export default CreateRemark
