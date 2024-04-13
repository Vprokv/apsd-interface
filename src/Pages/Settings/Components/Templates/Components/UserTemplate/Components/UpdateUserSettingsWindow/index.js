import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import UnderButtons from '@/Components/Inputs/UnderButtons'

import ModalWindowWrapper from '@/Components/ModalWindow'
import { URL_CREATE_UPDATE } from '@/ApiList'
import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import styled from 'styled-components'
import { setUnFetchedState, useReadDataState } from '@Components/Logic/Tab'
import { parseSettingsFuncMap } from '@/Pages/Settings/Components/Templates/constans'
import { rules, useGetFieldFormConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон обновлен успешно',
    }
  },
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
  const { 1: setTabState } = useReadDataState(SETTINGS_TEMPLATES)
  const [validationState, setValidationState] = useState({})

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

  const fields = useGetFieldFormConfig(api, branchesAccess, filter, usersAccess)

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
        <Validator
          rules={rules}
          onSubmit={onUpdate}
          value={filter}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => (
            <Form
              value={filter}
              onInput={setFilter}
              fields={fields}
              inputWrapper={WithValidationStateInputWrapper}
            >
              <UnderButtons
                // className="justify-around w-full"
                leftStyle="width-min mr-2"
                rightStyle="width-min"
                leftFunc={handleClick}
                leftLabel="Отменить"
                rightLabel="Сохранить"
                rightFunc={onSubmit}
              />
            </Form>
          )}
        </Validator>
      </StandardSizeModalWindow>
    </div>
  )
}

UpdateSettingsWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default UpdateSettingsWindow
