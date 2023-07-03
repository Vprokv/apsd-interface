import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ArchiveItem, {
  LevelTwoArchiveItem,
} from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveItem'
import { URL_KNOWLEDGE_STRUCTURE, URL_KNOWLEDGE_TITLE } from '@/ApiList'
import { useOpenNotification } from '@/Components/Notificator'
import { ApiContext } from '@/contants'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/Archive/Components/WithToggleNavigationItem'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import { SecondKnowledgeButton } from '@/Pages/Main/Components/SideBar/Components/KnowLedge/Components/KnowLedgeButton'

const apisMap = {
  0: async ({ api }) => {
    const { data } = await api.post(URL_KNOWLEDGE_TITLE)
    return data
  },
  // 1: async ({ api, id }) => {
  //   const { data } = await api.post(URL_KNOWLEDGE_STRUCTURE, {
  //     filter: {
  //       id,
  //     },
  //   })
  //   return data
  // },
  defaultRequest: async ({ api, id }) => {
    const { data } = await api.post(URL_KNOWLEDGE_STRUCTURE, {
      filter: {
        id,
      },
    })
    return data
  },
}

const KnowLedgeItem = ({
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
  useEffect(() => {
    ;(async () => {
      try {
        const { [level]: req = apisMap.defaultRequest } = apisMap
        setItems(await req({ api, id }))
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    })()
  }, [api, level, id, sectionId, setItems, query, getNotification])

  return items.map(({ id: levelId, name, expand }) => (
    <WithToggleNavigationItem id={levelId} key={levelId}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className=" font-size-12 mt-2 ">
          <div className="flex w-full py-1.5 justify-start">
            {expand && (
              <button
                className="pl-2 mr-2 "
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
            <ButtonComponent
              id={id}
              level={level}
              width={width}
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

KnowLedgeItem.propTypes = {
  level: PropTypes.number,
  id: PropTypes.string,
  onOpenNewTab: PropTypes.func.isRequired,
}

KnowLedgeItem.defaultProps = {
  level: 0,
  parentName: 123123,
  buttonComponent: SecondKnowledgeButton,
  childrenComponent: ArchiveItem,
}

export const LevelOneKnowledgeItem = ({ id, ...props }) => (
  <ArchiveItem
    {...props}
    id={id}
    buttonComponent={SecondKnowledgeButton}
    childrenComponent={LevelTwoKnowledgeItem}
  />
)
LevelOneKnowledgeItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export const LevelTwoKnowledgeItem = ({ id, ...props }) => (
  <ArchiveItem {...props} id={id} />
)
LevelTwoArchiveItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default KnowLedgeItem
