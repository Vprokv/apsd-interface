import { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_BUSINESS_DOCUMENT_ROUTE_CHANGE } from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { rules, useFormFieldConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Изменение стадии прошло успешно',
    }
  },
}

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 500px;
  margin: auto;
`

const ChangeRouteWindow = ({ open, onClose, documentId, reloadData }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({ pdInIa: false })
  const [validationState, setValidationState] = useState({})
  const getNotification = useOpenNotification()
  const [openSmall, setOpenSmall] = useState(false)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenSmall(nextState)
    },
    [],
  )

  const fields = useFormFieldConfig(api())

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(URL_BUSINESS_DOCUMENT_ROUTE_CHANGE, {
        documentId,
        ...filter,
      })
      getNotification(customMessagesFuncMap[status]())
      reloadData()
      onClose()
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, documentId, filter, getNotification, onClose, reloadData])

  return (
    <ModalWindow
      title="Смена маршрута рассмотрения"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col overflow-hidden ">
        <Validator
          value={filter}
          rules={rules}
          onSubmit={changeModalState(true)}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => {
            return (
              <>
                <Form
                  className="form-element-sizes-40 grid"
                  onInput={setFilter}
                  value={filter}
                  fields={fields}
                  inputWrapper={WithValidationStateInputWrapper}
                />
                <div className="mt-10">
                  <UnderButtons rightFunc={onSubmit} leftFunc={onClose} />
                </div>
                <MiniModalWindow
                  сlassName="font-size-14"
                  open={openSmall}
                  onClose={changeModalState(false)}
                  title=""
                  index={10000}
                >
                  <>
                    <div className="flex flex-col overflow-hidden h-full mb-4">
                      Вы уверены, что хотите сменить маршрут согласования ?
                    </div>
                    <UnderButtons
                      className={'w-full'}
                      rightFunc={onSave}
                      rightLabel={'Да'}
                      leftFunc={changeModalState(false)}
                      leftLabel={'Нет'}
                      rightStyle={'w-full'}
                      leftStyle={'w-full mr-4'}
                    />
                  </>
                </MiniModalWindow>
              </>
            )
          }}
        </Validator>
      </div>
    </ModalWindow>
  )
}

ChangeRouteWindow.propTypes = {}

export default ChangeRouteWindow
