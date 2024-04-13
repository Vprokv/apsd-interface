import { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
import {
  ItemContainer,
  MarginContainer,
  StyledRowContainer,
} from '@/Pages/Main/Components/SideBar/Components/Archive/Components/styles'

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
  const { loading, setLoading, lastSelected, setLastSelected } = useContext(
    ContextArchiveLoading,
  )
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
        setLoading((prev) => {
          const nextVal = new Set(prev)
          nextVal.delete(level >= 3 ? sectionId : id)
          return nextVal
        })
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

  const addToSet = useCallback(
    (id) => {
      setLoading((prev) => {
        const nextVal = new Set(prev)
        nextVal.add(id)
        return nextVal
      })
    },
    [setLoading],
  )

  return items.map(({ id: levelId, name, expand }) => (
    <WithToggleNavigationItem id={levelId} key={levelId}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <ItemContainer>
          <StyledRowContainer isSelected={lastSelected === name}>
            <MarginContainer level={level}>
              {expand && (
                <LevelToggleIcon
                  levelId={levelId}
                  loading={loading}
                  toggleDisplayedFlag={() => {
                    if (!isDisplayed) {
                      addToSet(levelId)
                      toggleDisplayedFlag()
                    } else {
                      toggleDisplayedFlag()
                    }
                  }}
                  isDisplayed={isDisplayed}
                />
              )}
              <ButtonComponent
                id={id}
                key={id}
                level={level}
                width={width}
                name={name}
                sectionId={levelId}
                parentName={parentName}
                onOpenNewTab={(args) => {
                  setLastSelected(name)
                  onOpenNewTab(args)
                }}
              />
            </MarginContainer>
          </StyledRowContainer>
          {isDisplayed && (
            <div className="flex flex-col">
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
        </ItemContainer>
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
