import React, { useCallback, useContext } from 'react'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/DeleteContain'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { URL_INFORMATION_DELETE } from '@/ApiList'

const DeleteWindow = ({ onClose, open, id, loadData }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const onDelete = useCallback(async () => {
    try {
      await api.post(URL_INFORMATION_DELETE, { id })
      loadData()
      onClose()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, onClose, getNotification, id, loadData])

  return (
    <MiniModalWindow
      сlassName="font-size-14"
      open={open}
      onClose={onClose}
      title=""
    >
      <>
        <div className="flex flex-col overflow-hidden h-full mb-4">
          Вы уверены, что хотите удалить выбранную запись ?
        </div>
        <UnderButtons
          rightFunc={onDelete}
          rightLabel={'Да'}
          leftFunc={onClose}
          leftLabel={'Нет'}
          rightStyle={''}
          leftStyle={'mr-4'}
        />
      </>
    </MiniModalWindow>
  )
}

export default DeleteWindow
