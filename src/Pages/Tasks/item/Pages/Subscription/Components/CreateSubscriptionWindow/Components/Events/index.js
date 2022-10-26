import { useContext, useMemo } from 'react'
import { EventsContext } from '@/Pages/Tasks/item/Pages/Subscription/Components/CreateSubscriptionWindow/constans'

const Events = ({ events = [] }) => {
  const value = useContext(EventsContext)

  return useMemo(
    () => (
      <div className={`word-wrap-anywhere font-size-14`}>
        {events.reduce((acc, val, i, arr) => {
          if (value.has(val)) {
            acc.push(
              (i < arr.length - 1 && <div>{value.get(val)},</div>) || (
                <div>{value.get(val)}</div>
              ),
            )
          }
          return acc
        }, [])}
      </div>
    ),

    [events, value],
  )
}
export default Events
