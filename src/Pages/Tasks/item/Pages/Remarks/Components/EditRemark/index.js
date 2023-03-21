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
import InputWrapper, {
  InputLabel,
  InputLabelStart,
} from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import {
  ShowAnswerButtonContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import log from 'tailwindcss/lib/util/log'
import UserSelect from '@/Components/Inputs/UserSelect'

const EditRemark = ({
  onClose,
  open,
  remarkText,
  ndtLinks = [],
  remarkId,
  remarkMemberFullName,
  remarkType,
}) => {
  const { editAuthor } = useContext(ShowAnswerButtonContext)
  const api = useContext(ApiContext)
  const update = useContext(UpdateContext)
  const [filter, setFilterValue] = useState({
    text: remarkText,
    ndtLinks,
    remarkTypeId: remarkType,
    member: {
      emplId: `${remarkMemberFullName}`,
      fullDescription: `${remarkMemberFullName}`,
    },
  })

  const fields = [
    {
      id: 'member',
      label: 'Автор',
      disabled: !editAuthor,
      returnOption: true,
      returnObjects: true,
      component: UserSelect,
    },
    {
      id: 'remarkTypeId',
      component: LoadableSelect,
      placeholder: 'Выберите тип',
      options: [
        {
          r_object_id: remarkType,
          dss_name: remarkType,
        },
      ],
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
    const { ndtLinks, member, ...other } = filter //TODO добавить member, когда появится ид
    await api.post(URL_REMARK_UPDATE, {
      remarkId,
      ndtLinks: ndtLinks.map(({ id, comment }) => {
        return { id, comment }
      }),
      ...other,
    })
    update()
    onClose()
  }, [filter, api, remarkId, update, onClose])

  return (
    <StandardSizeModalWindow
      title="Откорректировать замечание"
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
            onSubmit={onSave}
          >
            <div className="flex">
              <InputLabel>
                {'Ссылка нa НДТ'} {<InputLabelStart>*</InputLabelStart>}
              </InputLabel>
              <LinkNdt value={filter.ndtLinks} onInput={setFilterValue} />
              <div className="mt-10">
                <UnderButtons leftFunc={onClose} />
              </div>
            </div>
          </FilterForm>
        </div>
      </div>
    </StandardSizeModalWindow>
  )
}

EditRemark.propTypes = {}

export default EditRemark
