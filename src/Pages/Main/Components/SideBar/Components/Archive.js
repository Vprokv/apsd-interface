import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import ArchiveIcon from '../icons/ArchiveIcon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext } from '@/contants'
import {
  URL_STORAGE_BRANCH,
  URL_STORAGE_TITLE,
  URL_STORAGE_DOCUMENT,
} from '@/ApiList'
import { useParams } from 'react-router-dom'
import { LOGIN_PAGE_PATH } from '@/routePaths'
import ScrollBar from '@Components/Components/ScrollBar'

const Storage = (props) => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [branches, setBranches] = useState([])
  const [titles, setTitles] = useState([])
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_STORAGE_BRANCH)
      setBranches(data)
    })()
  }, [api])

  const renderArchiveItem = useCallback(
    (url) =>
      ({ id, name }) =>
        (
          <WithToggleNavigationItem id={id} key={id} url={url}>
            {({ isDisplayed, toggleDisplayedFlag, child }) => (
              <div className="font-size-12 mt-2 pl-2">
                <button
                  type="button"
                  className="flex w-full py-1.5"
                  onClick={toggleDisplayedFlag}
                >
                  <span className="mr-auto">{name}</span>
                  <Icon
                    icon={angleIcon}
                    size={10}
                    className={`color-text-secondary ${
                      isDisplayed ? '' : 'rotate-180'
                    }`}
                  />
                </button>
                {isDisplayed && (
                  <div className="flex flex-col pl-4">
                    {Array.isArray(child)
                      &&child?.map(renderArchiveItem(URL_STORAGE_DOCUMENT))
                      // : child?.content?.map(renderArchiveItem(URL_STORAGE_DOCUMENT))
                    }
                  </div>
                )}
              </div>
            )}
          </WithToggleNavigationItem>
        ),
    [],
  )

  return (
    <WithToggleNavigationItem id="Архив">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4">
          <button
            className="flex items-center w-full "
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={ArchiveIcon} size={24} />
            <span className="font-size-14 mr-auto font-medium">Архив</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={isDisplayed ? '' : 'rotate-180'}
            />
          </button>
          {isDisplayed && (
            <ScrollBar>
              {branches.map(renderArchiveItem(URL_STORAGE_TITLE))}
            </ScrollBar>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

Storage.propTypes = {}

export default Storage
