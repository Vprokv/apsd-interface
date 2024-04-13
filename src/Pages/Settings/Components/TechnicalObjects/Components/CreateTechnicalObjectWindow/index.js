import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CreateTechnicalObjectsWindowComponent,
  FilterWindowForm,
} from '@/Pages/Settings/Components/TechnicalObjects/styles'
import Validator from '@Components/Logic/Validator'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { URL_TECHNICAL_OBJECTS_CREATE } from '@/ApiList'
import { ApiContext, SETTINGS_TECHNICAL_OBJECTS } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import { rules, useGetFieldFormConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Технический объект создан успешно',
    }
  },
}

const CreateTechnicalObjectWindow = ({ onClose, ...props }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const [validationState, setValidationState] = useState({})
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({ stateId: SETTINGS_TECHNICAL_OBJECTS })

  const filterFormConfig = useGetFieldFormConfig(api)

  const onCreate = useCallback(async () => {
    try {
      const response = await api.post(URL_TECHNICAL_OBJECTS_CREATE, filter)
      getNotification(customMessagesFuncMap[response.status]())
      setTabState(setUnFetchedState())

      onClose()
    } catch (e) {
      const { response: { status = 500, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, filter, getNotification, onClose, setTabState])

  return (
    <div>
      <CreateTechnicalObjectsWindowComponent
        {...props}
        onClose={onClose}
        title="Добавление технического объекта"
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
            <>
              <FilterWindowForm
                inputWrapper={WithValidationStateInputWrapper}
                fields={filterFormConfig}
                value={filter}
                onInput={setFilter}
              />
              <div className="flex justify-end form-element-sizes-40 mt-4">
                <SecondaryGreyButton className="ml-2 w-64" onClick={onClose}>
                  Отменить
                </SecondaryGreyButton>
                <LoadableSecondaryOverBlueButton
                  className=" w-64"
                  onClick={onSubmit}
                >
                  Сохранить
                </LoadableSecondaryOverBlueButton>
              </div>
            </>
          )}
        </Validator>
      </CreateTechnicalObjectsWindowComponent>
    </div>
  )
}

CreateTechnicalObjectWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
}

export default CreateTechnicalObjectWindow
