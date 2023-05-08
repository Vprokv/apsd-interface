import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'
import CheckBoxEventComponent from '@/Pages/Settings/Components/Notification/Components/CheckBoxEventComponent'

const ChannelItemComponent = ({ name, label, events }) => {
  const { channels } = useContext(ChannelContext)
  return (
    <>
      <div className="w-32 m-4">{label}</div>
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

ChannelItemComponent.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  events: PropTypes.array,
}

export default ChannelItemComponent
