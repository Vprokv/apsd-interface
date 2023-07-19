import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useOpenNotification } from '@/Components/Notificator'
import { ApiContext } from '@/contants'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { URL_DEPUTY_USERS_LIST } from '@/ApiList'
import { TASK_LIST_PATH } from '@/routePaths'
import { EXPIRED_TODAY, TabNames } from '@/Pages/Tasks/list/constants'
import { NavigationHeaderIcon } from '@/Pages/Main/Components/SideBar/style'
import NavigationDocumentIcon from '@/Pages/Main/Components/SideBar/icons/NavigationDocumentIcon'

const DeputyPeople = ({ task, onOpenNewTab }) => {
  const [people, setPeople] = useState([])

  const getNotification = useOpenNotification()
  const api = useContext(ApiContext)
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.post(URL_DEPUTY_USERS_LIST)

        setPeople(data)
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    })()
  }, [api, getNotification])

  const peopleWidthTask = useMemo(
    () =>
      people.reduce((acc, val) => {
        const { userName: userCompanyName } = val
        if (task) {
          const userData = task.find(
            ({ userName }) => userName === userCompanyName,
          )

          if (userData) {
            acc.push({ ...userData, ...val })
          }
        }

        return acc
      }, []),

    [people, task],
  )

  const openTaskList = useCallback(
    ({ lastName, firstName, middleName, userName }) =>
      () =>
        onOpenNewTab(
          `/task/deputy/${lastName} ${firstName[0]}.${middleName[0]}/${userName}`,
        ),
    [onOpenNewTab],
  )

  return (
    <div className="px-2 font-size-12">
      {peopleWidthTask.map(
        ({ lastName, middleName, firstName, userName, all }) => (
          <button
            key={userName}
            className="flex items-center w-full mb-2"
            onClick={openTaskList({
              lastName,
              middleName,
              firstName,
              userName,
            })}
          >
            <NavigationHeaderIcon icon={NavigationDocumentIcon} size={22} />
            <span className=" mr-auto font-medium">
              {`Задания (${lastName} ${firstName[0]}.${middleName[0]}.)`}
            </span>
            <span className="font-medium color-blue-1">{all}</span>
          </button>
        ),
      )}
    </div>
  )
}

DeputyPeople.propTypes = {}

export default DeputyPeople
