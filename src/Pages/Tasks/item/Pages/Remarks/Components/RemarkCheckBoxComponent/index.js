import React, { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { URL_REMARK_EDIT_SET_REMARK } from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: (mess) => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: mess,
    }
  },
  undefined: {
    type: NOTIFICATION_TYPE_ERROR,
    message: 'Не удалось отправить запрос',
  },
}

const RemarkCheckBoxComponent = ({
  remarkId,
  setRemark,
  permits: { vault },
}) => {
  const api = useContext(ApiContext)
  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })
  const getNotification = useOpenNotification()

  const onSetRemark = useCallback(async () => {
    try {
      const { status } = await api.post(URL_REMARK_EDIT_SET_REMARK, {
        remarkIds: [remarkId],
        vault: !setRemark,
      })
      getNotification(
        customMessagesFuncMap[status]('Изменение выполнено успешно'),
      )
      setTabState({ loading: false, fetched: false })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, getNotification, remarkId, setRemark, setTabState])

  return (
    <div className="ml-2">
      <CheckBox onInput={onSetRemark} disabled={!vault} value={setRemark} />
    </div>
  )
}

RemarkCheckBoxComponent.propTypes = {
  remarkId: PropTypes.string,
  setRemark: PropTypes.bool,
  permits: PropTypes.object,
}

export default RemarkCheckBoxComponent
