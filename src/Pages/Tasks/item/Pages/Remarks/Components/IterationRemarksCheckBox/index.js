import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import { URL_REMARK_EDIT_SET_REMARK } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  [undefined]: {
    type: NOTIFICATION_TYPE_ERROR,
    message: 'Не удалось отправить запрос',
  },
}

const IterationRemarksCheckBoxComponent = ({ remarks }) => {
  const api = useContext(ApiContext)
  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })
  const getNotification = useOpenNotification()
  const disabled = useMemo(() => {
    let val = true
    if (remarks.length) {
      val = !remarks[0]?.permits?.vault
    }
    return val
  }, [remarks])

  const vault = useMemo(
    () => remarks?.some(({ setRemark }) => setRemark === false),
    [remarks],
  )

  const onSetRemark = useCallback(async () => {
    try {
      const { status } = await api.post(URL_REMARK_EDIT_SET_REMARK, {
        remarkIds: remarks?.map(({ remarkId }) => remarkId),
        vault,
      })
      getNotification(customMessagesFuncMap[status]())
      setTabState(setUnFetchedState())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, getNotification, remarks, setTabState, vault])

  return (
    <div className="ml-2">
      <CheckBox value={!vault} onInput={onSetRemark} disabled={disabled} />
    </div>
  )
}

IterationRemarksCheckBoxComponent.propTypes = {
  remarks: PropTypes.array,
}

export default IterationRemarksCheckBoxComponent
