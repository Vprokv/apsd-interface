import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { WithValidationForm } from '@Components/Components/Forms'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import Input from '@/Components/Fields/Input'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import {URL_ENTITY_LIST, URL_REPORTS_BRANCH} from '@/ApiList'
import { ApiContext } from '@/contants'
import UserSelect from '@/Components/Inputs/UserSelect'

const rules = {
  dssName: [{ name: VALIDATION_RULE_REQUIRED }],
  privateAccess: [{ name: VALIDATION_RULE_REQUIRED }],
}

const CreateWindow = ({ changeModalState, open, value }) => {
  const [filter, setFilter] = useState({})
  const api = useContext(ApiContext)

  const fields = useMemo(
    () => [
      {
        id: 'dssName',
        component: Input,
        label: 'Поиск',
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
      {
        id: 'dssNote',
        component: Input,
        label: 'Примечание',
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
      {
        id: 'privateAccess',
        component: Select,
        multiple: false,
        label: 'Доступ к шаблону',
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options: [
          {
            typeName: 'false',
            typeLabel: 'Только для автора',
          },
          {
            typeName: 'true',
            typeLabel: 'Всей организации',
          },
        ],
      },
      {
        label: 'Филиал',
        id: 'branchesAccess',
        component: LoadableSelect,
        valueKey: 'id',
        labelKey: 'name',
        placeholder: 'Тип файла',
        multiple: true,
        loadFunction: async (query) => {
          const {
            data: { content },
          } = await api.post(URL_REPORTS_BRANCH, {
            type: 'branch_list',
            filter: {
              query,
              useAllFilter: true,
            },
          })
          return content
        },
      },
      {
        id: 'approvers',
        component: UserSelect,
        multiple: true,
        returnOption: false,
        className: 'font-size-12',
        placeholder: 'Выборите сотрудников',
        label: 'Выбор сотрудников',
      },
    ],
    [api],
  )

  const onCreate = useCallback(() => {}, [])

  const handleClick = useCallback(() => null, [])

  return (
    <div>
      <StandardSizeModalWindow
        title="Сохранить шаблон"
        open={open}
        onClose={changeModalState(false)}
      >
        <>
          <WithValidationForm
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={InputWrapper}
            rules={rules}
            onSubmit={handleClick}
          >
            <UnderButtons
              // className="justify-around w-full"
              leftStyle="width-min mr-2"
              rightStyle="width-min"
              leftFunc={changeModalState(false)}
              leftLabel="Отменить"
              rightLabel="Сохранить"
            />
          </WithValidationForm>
        </>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateWindow.propTypes = {}

export default CreateWindow
