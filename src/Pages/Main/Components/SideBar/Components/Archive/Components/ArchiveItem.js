import { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import {
  URL_STORAGE_BRANCH,
  URL_STORAGE_SECTION,
  URL_STORAGE_TITLE,
} from '@/ApiList'
import {
  LevelToggleIcon,
  OthersLevelsArchiveButton,
  SecondArchiveButton,
} from './ArchiveButton'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/Archive/Components/WithToggleNavigationItem'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { ContextArchiveLoading } from '@/Pages/Main/Components/SideBar/Components/Archive/constants'

const apisMap = {
  0: async ({ api, query }) => {
    const { data } = await api.post(URL_STORAGE_BRANCH, { filter: { query } })
    return data
  },
  1: async ({ api, id, query }) => {
    const { data } = await api.post(URL_STORAGE_TITLE, {
      filter: {
        branchId: id,
        query,
      },
    })
    return data
  },
  defaultRequest: async ({ api, id, sectionId }) => {
    const { data } = await api.post(URL_STORAGE_SECTION, {
      filter: {
        titleId: id,
        sectionId,
      },
    })
    return data
  },
}

const ArchiveItem = ({
  parentName,
  level,
  id,
  onOpenNewTab,
  sectionId,
  query,
  width,
  buttonComponent: ButtonComponent,
  childrenComponent: ChildrenComponent,
}) => {
  const [items, setItems] = useState([])
  const getNotification = useOpenNotification()
  const api = useContext(ApiContext)
  const { loading, setLoading } = useContext(ContextArchiveLoading)
  const refTimeout = useRef()
  const refAbortController = useRef(null)
  useEffect(() => {
    clearTimeout(refTimeout.current)
    refTimeout.current = setTimeout(async () => {
      try {
        const { [level]: req = apisMap.defaultRequest } = apisMap
        if (refAbortController.current) {
          // если есть старый контроллер, значит есть запрос, отменяем прошлый запрос
          refAbortController.current.abort()
        }
        // создаем новый контроллер под актуальный запрос
        refAbortController.current = new AbortController()
        setItems(await req({ api, id, sectionId, query }))
        // сбрасываем контроллер по завершению запроса
        refAbortController.current = null
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      } finally {
        setLoading()
      }
    }, 1000)
  }, [api, level, id, sectionId, setItems, query, getNotification, setLoading])

  useEffect(
    () => () => {
      clearTimeout(refTimeout.current)
      refAbortController.current !== null && refAbortController.current()
    },
    [],
  )

  return items.map(({ id: levelId, name, expand }) => (
    <WithToggleNavigationItem id={levelId} key={levelId}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className=" font-size-12 mt-2 ">
          <div className="flex w-full py-1.5 justify-start">
            {expand && (
              <LevelToggleIcon
                levelId={levelId}
                loading={loading}
                toggleDisplayedFlag={toggleDisplayedFlag}
                isDisplayed={isDisplayed}
              />
            )}
            <ButtonComponent
              id={id}
              key={id}
              level={level}
              width={width}
              toggleChildrenRender={() => {
                if (!isDisplayed) {
                  setLoading(levelId)
                  toggleDisplayedFlag()
                } else {
                  toggleDisplayedFlag()
                }
              }}
              name={name}
              sectionId={levelId}
              parentName={parentName}
              onOpenNewTab={(args) => {
                if (isDisplayed) {
                  toggleDisplayedFlag()
                } else {
                  setLoading(levelId)
                  onOpenNewTab(args)
                  toggleDisplayedFlag()
                }
              }}
            />
          </div>
          {isDisplayed && (
            <div className="flex flex-col pl-4 ">
              <ChildrenComponent
                level={level + 1}
                width={width}
                id={id}
                query={query}
                sectionId={levelId}
                parentName={name}
                onOpenNewTab={onOpenNewTab}
              />
            </div>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  ))
}

ArchiveItem.propTypes = {
  level: PropTypes.number,
  id: PropTypes.string,
  onOpenNewTab: PropTypes.func.isRequired,
}

ArchiveItem.defaultProps = {
  level: 0,
  parentName: 123123,
  buttonComponent: OthersLevelsArchiveButton,
  childrenComponent: ArchiveItem,
}

// кастим сектионИд в ид
export const LevelOneArchiveItem = ({ sectionId, ...props }) => (
  <ArchiveItem
    {...props}
    id={sectionId}
    buttonComponent={SecondArchiveButton}
    childrenComponent={LevelTwoArchiveItem}
  />
)
LevelOneArchiveItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export const LevelTwoArchiveItem = ({ sectionId, ...props }) => (
  <ArchiveItem {...props} id={sectionId} />
)
LevelTwoArchiveItem.propTypes = {
  sectionId: PropTypes.string.isRequired,
}

export default ArchiveItem
