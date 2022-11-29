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
import { EmptyInputWrapper } from '@Components/Components/Forms'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import Input from '@/Components/Fields/Input'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import {
  URL_ENTITY_LIST,
  URL_REMARK_ANSWER,
  URL_REMARK_CREATE,
  URL_REMARK_UPDATE,
} from '@/ApiList'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useParams } from 'react-router-dom'
import Icon from '@Components/Components/Icon'
import editIcon from '@/Icons/editIcon'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'

const EditRemark = ({
  remarkText,
  ndtLinks,
  remarkType,
  setRemark,
  remarkId,
}) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [open, setOpenState] = useState(false)
  const [filter, setFilterValue] = useState({
    text: remarkText,
    ndtLinks,
    remarkTypeId: remarkType,
    setRemark,
  })
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
    const { ndtLinks, ...other } = filter
    await api.post(URL_REMARK_UPDATE, {
      remarkId,
      ndtLinks: ndtLinks.map(({ id, comment }) => {
        return { id, comment }
      }),
      ...other,
    })
  }, [api, filter, remarkId])

  return (
    <div>
      <Button onClick={changeModalState(true)} className="color-blue-1">
        <Icon icon={editIcon} />
      </Button>
      <StandardSizeModalWindow
        title="Откорректировать замечание"
        open={open}
        onClose={changeModalState(false)}
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
            <div className="flex form-element-sizes-40">
              <LinkNdt links={filter} setLinks={setFilterValue} />
            </div>
          </div>
        </div>
        <UnderButtons leftFunc={changeModalState(false)} rightFunc={onSave} />
      </StandardSizeModalWindow>
    </div>
  )
}

EditRemark.propTypes = {}

export default EditRemark
