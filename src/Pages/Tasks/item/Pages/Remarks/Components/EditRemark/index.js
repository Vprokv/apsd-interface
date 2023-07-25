import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'

import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { FilterForm } from './styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { URL_ENTITY_LIST, URL_REMARK_UPDATE } from '@/ApiList'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import {
  remarkValidator,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Remarks/constans'
import UserSelect from '@/Components/Inputs/UserSelect'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import {
  VALIDATION_RULE_MAX,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import { returnChildren } from '@Components/Components/Forms'
import { NdtLinkWrapper } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import useTabItem from '@Components/Logic/Tab/TabItem'

const rules = {
  member: [{ name: VALIDATION_RULE_REQUIRED }],
  remarkTypeId: [{ name: VALIDATION_RULE_REQUIRED }],
  text: [
    {
      name: VALIDATION_RULE_MAX,
      args: {
        max: 1024,
        text: 'Превышено допустимое количество символов для замечания',
      },
    },
    { name: VALIDATION_RULE_REQUIRED },
  ],
  'ndtLinks.*.id': [{ name: VALIDATION_RULE_REQUIRED }],
  'ndtLinks.*.comment': [{ name: VALIDATION_RULE_REQUIRED }],
  ndtLinks: [{ name: VALIDATION_RULE_REQUIRED }],
}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Замечание откорректировано успешно',
    }
  },
}

const ScrollBar = styled(SimpleBar)`
  min-height: 400px;
`

const EditRemark = ({
  onClose,
  open,
  remarkText,
  ndtLinks = [],
  remarkId,
  remarkTypeId,
  remarkType,
  permits: { editAuthor },
  remarkAuthor: { memberFullName, memberPosition, memberId },
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [filter, setFilterValue] = useState({
    text: remarkText,
    ndtLinks,
    remarkTypeId: remarkTypeId,
    member: {
      emplId: memberId,
      fullDescription: `${memberFullName}, ${memberPosition}`,
    },
  })

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
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
          r_object_id: remarkTypeId,
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
      inputWrapper: RemarkWrapper,
      component: CustomInput,
      placeholder: 'Введите текст замечания',
    },
    {
      id: 'ndtLinks',
      label: 'Ссылка нa НДТ',
      options: ndtLinks.map(({ ndtId, name }) => {
        return { r_object_id: ndtId, dss_name: name }
      }),
      component: LinkNdt,
      placeholder: 'Выберите значение',
      inputWrapper: returnChildren,
      InputUiContext: NdtLinkWrapper,
    },
  ]

  const onSave = useCallback(async () => {
    try {
      const { ndtLinks, member, ...other } = filter
      const { status } = await api.post(URL_REMARK_UPDATE, {
        remarkId,
        memberId: member.emplId,
        memberName: member.userName,
        ndtLinks: ndtLinks.map(({ id, ndtId, comment }) => ({
          id,
          comment,
          ndtId,
        })),
        ...other,
      })
      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [filter, api, remarkId, setTabState, getNotification, onClose])

  return (
    <StandardSizeModalWindow
      title="Откорректировать замечание"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <div className="flex flex-col py-4 h-full">
          <ScrollBar>
            <FilterForm
              className="form-element-sizes-40"
              fields={fields}
              value={filter}
              onInput={setFilterValue}
              rules={rules}
              inputWrapper={InputWrapper}
              onSubmit={onSave}
              validators={remarkValidator}
            >
              <div className="mt-10">
                <UnderButtons leftFunc={onClose} />
              </div>
            </FilterForm>
          </ScrollBar>
        </div>
      </div>
    </StandardSizeModalWindow>
  )
}

EditRemark.propTypes = {
  onClose: PropTypes.func,
  permits: PropTypes.object,
  remarkAuthor: PropTypes.object,
  remarkId: PropTypes.string,
  remarkTypeId: PropTypes.string,
  remarkType: PropTypes.string,
  ndtLinks: PropTypes.array,
  remarkText: PropTypes.string,
  open: PropTypes.bool,
}

export default EditRemark
