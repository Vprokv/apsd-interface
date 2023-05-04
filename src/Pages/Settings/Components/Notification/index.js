import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  URL_SUBSCRIPTION_CHANNELS,
  URL_SUBSCRIPTION_USER_CHANNELS,
  URL_SUBSCRIPTION_USER_CREATE,
  URL_SUBSCRIPTION_USER_DELETE,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { GridForm } from '@/Pages/Settings/Components/Notification/styles'
import ChannelItemComponent from '@/Pages/Settings/Components/Notification/Components/ChannelItemComponent'

const response = [
  {
    name: 'string12', // - системное наименование события подписки
    label: 'Событие 1', //- наименование для пользователя
    events: [
      // - список подписанных событий и каналов
      {
        eventId: '1', //- id события (по нему потом отправляем запрос отписки)
        eventName: 'string12', // - системное наименование события подписки
        channelName: 'string', //- системное имя канала
        channelId: 'string', //- id канала
      },
      {
        eventId: 'string', //- id события (по нему потом отправляем запрос отписки)
        eventName: 'string12', // - системное наименование события подписки
        channelName: 'email', //- системное имя канала
        channelId: '000000030001q56u', //- id канала
      },
    ],
  },
  {
    name: 'string13', // - системное наименование события подписки
    label: 'обытие 2', //- наименование для пользователя
    events: [
      // - список подписачнных событий и каналов
      {
        eventId: 'string', //- id события (по нему потом отправляем запрос отписки)
        eventName: 'string13', // - системное наименование события подписки
        channelName: 'apsd', //- системное имя канала
        channelId: '000000030001q56t', //- id канала
      },
      {
        eventId: 'string', //- id события (по нему потом отправляем запрос отписки)
        eventName: 'string13', // - системное наименование события подписки
        channelName: 'email', //- системное имя канала
        channelId: '000000030001q56u', //- id канала
      },
    ],
  },
]

const NotificationItem = (props) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const [channels, setChannels] = useState([])
  const [userChannels, setUserChannels] = useState([])
  console.log(channels, 'channels')
  console.log(userChannels, 'userChannels')

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_CHANNELS)
      setChannels(data)
    })()
  }, [api])

  useEffect(() => {
    if (filter?.typeDocument) {
      ;(async () => {
        // const { data } = await api.post(URL_SUBSCRIPTION_USER_CHANNELS, {
        //   typeDocument: filter?.typeDocument,
        // })
        setUserChannels(response)
      })()
    }
  }, [api, channels, filter?.typeDocument])

  const onCreate = useCallback(
    async (body) => {
      await api.post(URL_SUBSCRIPTION_USER_CREATE, body)
    },
    [api],
  )

  const onDelete = useCallback(
    async (eventId) => {
      await api.post(URL_SUBSCRIPTION_USER_DELETE, { eventId })
    },
    [api],
  )

  const openChannels = useMemo(
    () => (
      <GridForm>
        <div>Выберите из какого перечня хотите получать:</div>
        {channels.map(({ label }) => (
          <div key={label}>{label}</div>
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
        const { data } = await api.post(URL_TYPE_CONFIG, {
          // typeConfig: 'ddt_startup_complex_type_doc',
        })
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
      <GridForm>
        {userChannels.map((props) => (
          <ChannelItemComponent key={props.name} {...props} />
        ))}
      </GridForm>
    </div>
  )
}

NotificationItem.propTypes = {}

export default NotificationItem
