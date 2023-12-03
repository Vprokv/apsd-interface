import { useCallback, useContext } from 'react'
import { URL_SUBSCRIPTION_NOTIFICATION_WATCH } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useParams } from 'react-router-dom'
import { ApiContext, ITEM_DOCUMENT } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import Document from '@/Pages/Tasks/item/Document'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import useTabItem from '@Components/Logic/Tab/TabItem'

const DocumentWatchWrapper = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const [tabState, setTabState] = useTabItem({
    stateId: ITEM_DOCUMENT,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SUBSCRIPTION_NOTIFICATION_WATCH, {
        id,
        type,
      })
      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, getNotification, id, type])

  const [{ data }] = useAutoReload(loadData, tabState, setTabState)

  return <Document></Document>
}

export default DocumentWatchWrapper
