import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { WithValidationForm } from '@Components/Components/Forms'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import Input from '@/Components/Fields/Input'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { URL_CREATE_TEMPLATE, URL_REPORTS_BRANCH } from '@/ApiList'
import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import styled from 'styled-components'
import useTabItem from '@Components/Logic/Tab/TabItem'
import OrgStructureComponentWithTemplateWindowWrapper from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон создан успешно',
    }
  },
}

const rules = {
  dssName: [{ name: VALIDATION_RULE_REQUIRED }],
  privateAccess: [{ name: VALIDATION_RULE_REQUIRED }],
}

const funcMap = {
  user: () => ({ privateAccess: true }),
  organization: () => ({ allAccess: true }),
  department: ({ branchesAccess }) => ({ branchesAccess }),
  employee: ({ usersAccess }) => ({
    usersAccess: usersAccess?.map((val) => ({ emplId: val, val })),
  }),
}

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  //height: 72.65%;
  margin: auto;
`

const CreateWindow = ({
  changeModalState,
  open,
  value,
  onReverse,
  type,
  createFunc,
}) => {
  const [filter, setFilter] = useState({})
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({ stateId: SETTINGS_TEMPLATES })

  const fields = useMemo(
    () =>
      [
        {
          id: 'dssName',
          component: Input,
          label: 'Наименование',
          show: true,
        },
        {
          id: 'dssNote',
          component: Input,
          label: 'Примечание',
          show: true,
        },
        {
          id: 'privateAccess',
          component: Select,
          multiple: false,
          label: 'Доступ к шаблону',
          valueKey: 'typeName',
          labelKey: 'typeLabel',
          show: true,
          options: [
            {
              typeName: 'user',
              typeLabel: 'Только для автора',
            },
            {
              typeName: 'organization',
              typeLabel: 'Всей организации',
            },
            {
              typeName: 'department',
              typeLabel: 'Филиалу',
            },
            {
              typeName: 'employee',
              typeLabel: 'Сотруднику',
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
          show: filter?.privateAccess === 'department',
        },
        {
          id: 'usersAccess',
          component: UserSelect,
          // WindowComponent: OrgStructureComponentWithTemplateWindowWrapper, //todo
          multiple: true,
          className: 'font-size-12',
          placeholder: 'Выборите сотрудников',
          label: 'Выбор сотрудников',
          show: filter?.privateAccess === 'employee',
        },
      ].filter(({ show }) => show),
    [api, filter],
  )

  const onCreate = useCallback(async () => {
    try {
      const { privateAccess, dssName, dssNote } = filter
      const { [privateAccess]: func } = funcMap
      const parseResult = func(filter)

      const data = await createFunc(api)({
        ...parseResult,
        dssName,
        dssNote,
      })(type)(value)

      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[data?.status]())
      onReverse()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(customMessagesFuncMap[status](data?.dssName))
    }
  }, [
    api,
    createFunc,
    filter,
    getNotification,
    onReverse,
    setTabState,
    type,
    value,
  ])

  const handleClick = useCallback(() => {
    changeModalState(false)()
    setFilter({})
  }, [changeModalState])

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
            // onSubmit={handleClick}
          >
            <UnderButtons
              // className="justify-around w-full"
              leftStyle="width-min mr-2"
              rightStyle="width-min"
              leftFunc={handleClick}
              leftLabel="Отменить"
              rightLabel="Сохранить"
              rightFunc={onCreate}
            />
          </WithValidationForm>
        </>
      </StandardSizeModalWindow>
    </div>
  )
}

CreateWindow.propTypes = {}

export default CreateWindow
