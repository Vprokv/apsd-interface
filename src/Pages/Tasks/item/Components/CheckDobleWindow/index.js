import React, { useCallback, useContext } from 'react'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { URL_DOCUMENT_CREATE } from '@/ApiList'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useTabStateUpdaterByName } from '@/Utils/TabStateUpdaters'
import { useNavigate } from 'react-router-dom'
import ScrollBar from '@Components/Components/ScrollBar'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ создан',
    }
  },
  412: (message, err) => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: err ? 'Заполните обязательные поля' : message,
    }
  },
}

const CheckDoubleWindow = ({
  data,
  open,
  onClose,
  values,
  type,
  initialState,
  setDocumentState,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const remoteTabUpdater = useTabStateUpdaterByName()
  const navigate = useNavigate()

  const onSave = useCallback(async () => {
    try {
      const {
        status,
        data: { id },
      } = await api.post(URL_DOCUMENT_CREATE, {
        values,
        type,
      })
      getNotification(customMessagesFuncMap[status]())
      if (initialState?.parentTabName) {
        remoteTabUpdater(initialState.parentTabName, setUnFetchedState())
      }
      navigate(`/document/${id}/${type}`)
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      if (status === 412) {
        const { 1: responseError } = data.split(' - ')
        getNotification(customMessagesFuncMap[status](data, responseError))

        setDocumentState({
          validationState: {
            submitFailed: true,
            hasSubmitted: true,
          },
          backendValidationErrors: responseError
            .split(',')
            .reduce((acc, key) => {
              acc[key.trim()] = 'Поле заполненно неверно'
              return acc
            }, {}),
        })
      } else {
        getNotification(customMessagesFuncMap[status](data))
      }
    }
  }, [
    api,
    getNotification,
    initialState?.parentTabName,
    navigate,
    remoteTabUpdater,
    setDocumentState,
    type,
    values,
  ])

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title={'Проверка на дубли'}
    >
      <div className="flex flex-col overflow-hidden h-full w-full">
        <ScrollBar className="w-full">
          <div>В Системе существуют документы с заданными реквизитами:</div>
          {data.map(({ titleCode, sapCode, titleName }) => (
            <div
              key={titleCode}
              className="mt-2  mb-4 flex flex-col font-size-12"
            >
              <div className="color-blue-1">{`Код Sap: ${sapCode}`}</div>
              <div className="color-text-secondary">{`Код титула: ${titleCode}`}</div>
              <div className="color-blue-1">{`Наименование: ${titleName}`}</div>
            </div>
          ))}
        </ScrollBar>

        <div className="flex w-full justify-end flex-col mb-2">
          <div className="flex mt-2 ">Продолжить сохранение?</div>
          <UnderButtons
            leftLabel="Нет"
            rightLabel="Да"
            rightFunc={onSave}
            leftFunc={onClose}
          />
        </div>
      </div>
    </StandardSizeModalWindow>
  )
}

CheckDoubleWindow.propTypes = {}

export default CheckDoubleWindow
