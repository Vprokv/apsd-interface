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

const CreateRemark = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
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
      id: 'remarkTypeId',
      component: LoadableSelect,
      placeholder: 'Выберите тип',
      label: 'Тип замечания',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async () => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_type_remark',
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
    {
      id: 'setRemark',
      label: 'Свод замечаний',
      placeholder: 'Выберите замечание',
      options: [
        {
          ID: true,
          SYS_NAME: 'Включено',
        },
        {
          ID: false,
          SYS_NAME: 'Не включено',
        },
      ],
      component: Select,
    },
  ]

  const onSave = useCallback(async () => {
    await api.post(URL_REMARK_CREATE, {
      documentId: id,
      memberId: r_object_id,
      memberName: dss_user_name,
      ...filter,
    })
  }, [api, dss_user_name, filter, id, r_object_id])

  const onClose = useCallback(() => {
    changeModalState(false)()
    setFilterValue({})
  }, [changeModalState])

  return (
    <div>
      <SecondaryBlueButton onClick={changeModalState(true)}>
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
              inputWrapper={InputWrapper}
            />
            <div className="flex">
              <LinkNdt links={filter} setLinks={setFilterValue}>
                <SecondaryBlueButton className="ml-4 form-element-sizes-32">
                  Импорт значений
                </SecondaryBlueButton>
                <SecondaryBlueButton className="ml-4 form-element-sizes-32">
                  Скачать шаблон таблицы
                </SecondaryBlueButton>
              </LinkNdt>
            </div>
          </div>
        </div>
        <UnderButtons leftFunc={onClose} rightFunc={onSave} />
      </StandardSizeModalWindow>
    </div>
  )
}

CreateRemark.propTypes = {}

export default CreateRemark
