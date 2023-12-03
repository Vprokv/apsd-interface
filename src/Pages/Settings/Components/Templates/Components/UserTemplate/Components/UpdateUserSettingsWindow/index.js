import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { WithValidationForm } from '@Components/Components/Forms'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import Input from '@/Components/Fields/Input'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import ModalWindowWrapper from '@/Components/ModalWindow'
import {
  URL_CREATE_UPDATE,
  URL_REPORTS_BRANCH,
} from '@/ApiList'
import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'
import UserSelect, {
  AddUserOptionsFullName,
} from '@/Components/Inputs/UserSelect'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import styled from 'styled-components'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { parseSettingsFuncMap } from '@/Pages/Settings/Components/Templates/constans'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон обновлен успешно',
    }
  },
}

const rules = {
  dssName: [{ name: VALIDATION_RULE_REQUIRED }],
  privateAccess: [{ name: VALIDATION_RULE_REQUIRED }],
}

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 61.6%;
  //height: 72.65%;
  margin: auto;
`

const UpdateSettingsWindow = ({ onClose, open, type, data }) => {
  const { dss_name, dss_note, branchesAccess, usersAccess, dsid_template } =
    data

  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({ stateId: SETTINGS_TEMPLATES })

  const reverseParseFromBackend = useMemo(() => {
    const { branchesAccess, usersAccess, dsb_private } = data
    if (dsb_private) {
      return { privateAccess: 'user' }
    } else if (branchesAccess.length > 0) {
      return {
        privateAccess: 'department',
        branchesAccess: branchesAccess?.map(({ dsid_branch }) => dsid_branch),
      }
    } else if (usersAccess.length > 0) {
      return {
        privateAccess: 'employee',
        usersAccess: usersAccess.map(({ emplId }) => emplId),
      }
    } else {
      return { privateAccess: 'organization' }
    }
  }, [data])

  const [filter, setFilter] = useState({
    dssName: dss_name,
    dssNote: dss_note,
    ...reverseParseFromBackend,
  })

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
          options: branchesAccess.map(({ dsid_branch, dss_branch_name }) => ({
            id: dsid_branch,
            name: dss_branch_name,
          })),
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
          // WindowComponent: OrgStructureComponentWithTemplateWindowWrapper,//todo
          options: usersAccess.map(AddUserOptionsFullName),
          multiple: true,
          className: 'font-size-12',
          placeholder: 'Выборите сотрудников',
          label: 'Выбор сотрудников',
          show: filter?.privateAccess === 'employee',
        },
      ].filter(({ show }) => show),
    [api, branchesAccess, filter, usersAccess],
  )

  const onUpdate = useCallback(async () => {
    try {
      const { privateAccess, dssName, dssNote } = filter
      const { [privateAccess]: func } = parseSettingsFuncMap
      const parseResult = func(filter)
      const data = await api.post(URL_CREATE_UPDATE, {
        template: {
          dssName,
          dssNote,
          ...parseResult,
        },
        type,
        id: dsid_template,
      })
      setTabState(setUnFetchedState())
      getNotification(customMessagesFuncMap[data.status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, dsid_template, filter, getNotification, onClose, setTabState, type])

  const handleClick = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <div>
      <StandardSizeModalWindow
        title={`Редактирование шаблона "${dss_name}"`}
        open={open}
        onClose={onClose}
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
              rightFunc={onUpdate}
            />
          </WithValidationForm>
        </>
      </StandardSizeModalWindow>
    </div>
  )
}

UpdateSettingsWindow.propTypes = {}

export default UpdateSettingsWindow
