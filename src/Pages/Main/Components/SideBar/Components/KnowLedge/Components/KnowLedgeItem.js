import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ArchiveItem, {
  LevelTwoArchiveItem,
} from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveItem'
import { useOpenNotification } from '@/Components/Notificator'
import { ApiContext } from '@/contants'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/Archive/Components/WithToggleNavigationItem'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import { SecondKnowledgeButton } from '@/Pages/Main/Components/SideBar/Components/KnowLedge/Components/KnowLedgeButton'
import { URL_KNOWLEDGE_STRUCTURE, URL_KNOWLEDGE_TITLE } from '@/ApiList'
import log from "tailwindcss/lib/util/log";

const apisMap = {
  0: async ({ api }) => {
    const { data } = await api.post(URL_KNOWLEDGE_TITLE)
    return data
  },
  defaultRequest: async ({ api, id }) => {
    const { data } = await api.post(URL_KNOWLEDGE_STRUCTURE, {
      id,
    })
    return data
  },
}

const LevelTwoKnowledgeItem = ({
  parentName,
  level,
  childs,
  onOpenNewTab,
  query,
  width,
  buttonComponent: ButtonComponent,
  childrenComponent: ChildrenComponent,
}) => {
  return childs.map(
    ({
      id,
      name,
      expand = true,
      childs,
      readTaskCounts,
      allTaskCounts,
      tomId,
      ...props
    }) => (
      <WithToggleNavigationItem id={id} key={id}>
        {({ isDisplayed, toggleDisplayedFlag }) => (
          <div className=" font-size-12 mt-2 ">
            <div className="flex w-full py-1.5">
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
                key={id}
                id={id}
                level={level}
                width={width}
                toggleChildrenRender={toggleDisplayedFlag}
                name={name}
                parentName={parentName}
                onOpenNewTab={(args) => {
                  if (isDisplayed) {
                    toggleDisplayedFlag()
                  } else {
                    onOpenNewTab(args)
                    toggleDisplayedFlag()
                  }
                }}
                {...props}
              />
              {tomId && (
                <div className="font-medium ml-auto w-16 flex justify-end">{` ${readTaskCounts}/ ${allTaskCounts}`}</div>
              )}
            </div>
            {isDisplayed && (
              <div className="flex flex-col pl-4 ">
                <ChildrenComponent
                  childs={childs}
                  level={level + 1}
                  width={width}
                  id={id}
                  query={query}
                  parentName={name}
                  onOpenNewTab={onOpenNewTab}
                  buttonComponent={SecondKnowledgeButton}
                  childrenComponent={LevelTwoKnowledgeItem}
                  {...props}
                />
              </div>
            )}
          </div>
        )}
      </WithToggleNavigationItem>
    ),
  )
}
LevelTwoKnowledgeItem.defaultProps = {
  level: 0,
  parentName: 123123,
  childs: [],
  buttonComponent: SecondKnowledgeButton,
  childrenComponent: LevelTwoKnowledgeItem,
}

LevelTwoKnowledgeItem.propTypes = {
  id: PropTypes.string.isRequired,
}

const KnowLedgeItem = ({
  parentName,
  level,
  id,
  onOpenNewTab,
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
  }, [api, level, id, setItems, query, getNotification])

  return items.map(
    ({
      id,
      description,
      expand = true,
      childs,
      tomId,
      readTaskCounts,
      allTaskCounts,
      ...props
    }) => (
      <WithToggleNavigationItem id={id} key={id}>
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
                isDisplayed={isDisplayed}
                toggleChildrenRender={toggleDisplayedFlag}
                name={description}
                parentName={parentName}
                onOpenNewTab={onOpenNewTab}
                {...props}
              />
              {tomId && (
                <div className="font-medium ml-auto w-16  flex justify-end">{` ${readTaskCounts}/ ${allTaskCounts}`}</div>
              )}
            </div>
            {isDisplayed && (
              <div className="flex flex-col pl-4 ">
                <ChildrenComponent
                  childs={childs}
                  level={level + 1}
                  width={width}
                  id={id}
                  query={query}
                  parentName={description}
                  onOpenNewTab={onOpenNewTab}
                />
              </div>
            )}
          </div>
        )}
      </WithToggleNavigationItem>
    ),
  )
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
  childrenComponent: KnowLedgeItem,
}

export const LevelOneKnowledgeItem = ({ id, ...props }) => (
  <KnowLedgeItem
    {...props}
    id={id}
    buttonComponent={SecondKnowledgeButton}
    childrenComponent={LevelTwoKnowledgeItem}
  />
)

LevelOneKnowledgeItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default KnowLedgeItem
