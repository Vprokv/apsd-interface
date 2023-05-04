import React, { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  URL_SUBSCRIPTION_CHANNELS,
  URL_SUBSCRIPTION_USER_CHANNELS,
  URL_SUBSCRIPTION_USER_CREATE, URL_SUBSCRIPTION_USER_DELETE,
  URL_TYPE_CONFIG,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { FilterForm } from '@/Pages/Search/Pages/Components/SearchFields/styles'

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
    ;(async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_USER_CHANNELS, {
        channel: channels[1]?.id,
        typeDocument: filter?.typeDocument,
      })
      setUserChannels(data)
    })()
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
      <FilterForm
        fields={fields}
        inputWrapper={InputWrapper}
        value={filter}
        onInput={setFilter}
      />
    </div>
  )
}

NotificationItem.propTypes = {}

export default NotificationItem
