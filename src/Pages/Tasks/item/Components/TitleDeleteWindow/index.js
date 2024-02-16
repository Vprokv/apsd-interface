import React, { useCallback, useContext } from 'react'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_BASKET_DELETE_DOCUMENT } from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Титул удален успешно',
    }
  },
}

const TitleDeleteWindow = ({ open, onClose, documentId, closeCurrenTab }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(URL_BASKET_DELETE_DOCUMENT, {
        documentIds: [documentId],
      })
      getNotification(customMessagesFuncMap[status]())
      onClose()
      closeCurrenTab()
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, documentId, getNotification, onClose, closeCurrenTab])

  return (
    <MiniModalWindow
      сlassName="font-size-14"
      open={open}
      onClose={onClose}
      title=""
    >
      <>
        <div className="flex flex-col overflow-hidden h-full mb-4">
          Внимание! При удалении титула будут удалены все тома данного титула.
          Вы уверены в выполнении действия?
        </div>
        <UnderButtons
          className={'w-full'}
          rightFunc={onSave}
          rightLabel={'Да'}
          leftFunc={onClose}
          leftLabel={'Нет'}
          rightStyle={'w-full'}
          leftStyle={'w-full mr-4'}
        />
      </>
    </MiniModalWindow>
  )
}

export default TitleDeleteWindow
