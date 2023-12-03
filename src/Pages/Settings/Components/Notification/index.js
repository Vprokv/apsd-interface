import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  URL_SUBSCRIPTION_CHANNELS,
  URL_SUBSCRIPTION_USER_CHANNELS,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { GridForm } from '@/Pages/Settings/Components/Notification/styles'
import ChannelItemComponent from '@/Pages/Settings/Components/Notification/Components/ChannelItemComponent'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'

const NotificationItem = () => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({
    typeDocument: 'ddt_project_calc_type_doc',
  })
  const [channels, setChannels] = useState([])
  const [userChannels, setUserChannels] = useState([])
  const getNotification = useOpenNotification()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.post(URL_SUBSCRIPTION_CHANNELS)
        setChannels(data)
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    })()
  }, [api, getNotification])

  const loadFunction = useCallback(async () => {
    try {
      const { data } = await api.post(URL_SUBSCRIPTION_USER_CHANNELS, {
        typeDocument: filter?.typeDocument,
      })
      setUserChannels(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter?.typeDocument, getNotification])

  useEffect(() => {
    if (filter?.typeDocument) {
      loadFunction()
    }
  }, [api, channels, filter?.typeDocument, loadFunction])

  const openChannels = useMemo(
    () => (
      <GridForm>
        <div>Выберите из какого перечня хотите получать:</div>
        {channels.map(({ label }) => (
          <div className={' flex items-center justify-center'} key={label}>
            {label}
          </div>
        ))}
      </GridForm>
    ),
    [channels],
  )
  const fields = [
    {
      id: 'typeDocument',
      label: 'Тип документа',
      component: LoadableSelect,
      valueKey: 'typeName',
      labelKey: 'typeLabel',
      options: [
        {
          typeName: 'ddt_project_calc_type_doc',
          typeLabel: 'Том',
        },
      ],
      loadFunction: async () => {
        const { data } = await api.post(URL_TYPE_CONFIG, {})
        return data
      },
    },
  ]

  return (
    <div className="m-4">
      <GridForm
        fields={fields}
        inputWrapper={InputWrapper}
        value={filter}
        onInput={setFilter}
      />
      {openChannels}
      <ChannelContext.Provider
        value={{ channels, loadFunction, documentType: filter?.typeDocument }}
      >
        <GridForm>
          {userChannels.map((props) => (
            <ChannelItemComponent key={props.name} {...props} />
          ))}
        </GridForm>
      </ChannelContext.Provider>
    </div>
  )
}

NotificationItem.propTypes = {}

export default NotificationItem
