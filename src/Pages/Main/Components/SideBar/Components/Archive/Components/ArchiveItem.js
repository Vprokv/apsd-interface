import { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import {
  URL_STORAGE_BRANCH,
  URL_STORAGE_SECTION,
  URL_STORAGE_TITLE,
} from '@/ApiList'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import { OthersLevelsArchiveButton, SecondArchiveButton } from './ArchiveButton'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/Archive/Components/WithToggleNavigationItem'

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
  buttonComponent: ButtonComponent,
  childrenComponent: ChildrenComponent,
}) => {
  const [items, setItems] = useState([])
  const api = useContext(ApiContext)
  useEffect(() => {
    ;(async () => {
      const { [level]: req = apisMap.defaultRequest } = apisMap
      setItems(await req({ api, id, sectionId, query }))
    })()
  }, [api, level, id, sectionId, setItems, query])

  return items.map(({ id: levelId, name, expand }) => (
    <WithToggleNavigationItem id={levelId} key={levelId}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className=" font-size-12 mt-2 ">
          <div className="flex w-full py-1.5 justify-between">
            <ButtonComponent
              id={id}
              toggleChildrenRender={toggleDisplayedFlag}
              name={name}
              sectionId={levelId}
              parentName={parentName}
              onOpenNewTab={(args) => {
                if (isDisplayed) {
                  toggleDisplayedFlag()
                } else {
                  onOpenNewTab(args)
                  toggleDisplayedFlag()
                }
              }}
            />
            {expand && (
              <button
                className="pl-2 "
                type="button"
                onClick={toggleDisplayedFlag}
              >
                <Icon
                  icon={angleIcon}
                  size={10}
                  className={`color-text-secondary ${
                    isDisplayed ? '' : 'rotate-180'
                  }`}
                />
              </button>
            )}
          </div>

          {isDisplayed && (
            <div className="flex flex-col pl-4 ">
              <ChildrenComponent
                level={level + 1}
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
