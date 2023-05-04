import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'
import CheckBoxEventComponent from '@/Pages/Settings/Components/Notification/Components/CheckBoxEventComponent'
import { ApiContext } from '@/contants'

const ChannelItemComponent = ({ name, label, events }) => {
  const { channels } = useContext(ChannelContext)
  return (
    <>
      <div>{label}</div>
      {channels.map(({ id: channelId }) => (
        <CheckBoxEventComponent
          name={name}
          key={channelId}
          channelId={channelId}
          events={events}
        />
      ))}
    </>
  )
}

ChannelItemComponent.propTypes = {}

export default ChannelItemComponent
