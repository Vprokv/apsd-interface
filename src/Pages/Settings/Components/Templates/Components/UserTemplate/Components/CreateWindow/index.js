import { useCallback, useContext, useState } from 'react'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { rules, useGetFieldFormConfig } from './configs/formConfig'
import ModalWindowWrapper from '@/Components/ModalWindow'

import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'

import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import styled from 'styled-components'
import useTabItem from '@Components/Logic/Tab/TabItem'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон создан успешно',
    }
  },
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
  const [validationState, setValidationState] = useState({})
  const [filter, setFilter] = useState({})
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const { 1: setTabState } = useTabItem({ stateId: SETTINGS_TEMPLATES })

  const fields = useGetFieldFormConfig(api, filter)

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

      setTabState(setUnFetchedState())
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
        <Validator
          rules={rules}
          onSubmit={onCreate}
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

CreateWindow.propTypes = {}

export default CreateWindow
