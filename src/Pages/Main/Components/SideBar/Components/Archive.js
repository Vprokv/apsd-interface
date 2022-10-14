import React, { useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { NavigationHeaderIcon } from '../style'
import ArchiveIcon from '../icons/ArchiveIcon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, STORAGE, WINDOW_ADD_SUBSCRIPTION } from '@/contants'
import { URL_STORAGE_LIST, URL_SUBSCRIPTION_EVENTS } from '@/ApiList'
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
      const { data } = await api.post(URL_STORAGE_LIST)
      setBranches(data)
    })()
  }, [api])

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_STORAGE_LIST)
      setBranches(data)
    })()
  }, [api])

  console.log(data, 'data')

  const links = useMemo(
    () => (
      <>
        {data.map(({ id, name }) => (
          <WithToggleNavigationItem id={id} key={id}>
            {({ isDisplayed, toggleDisplayedFlag }) => (
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
              </div>
            )}
          </WithToggleNavigationItem>
        ))}
      </>
    ),
    [data],
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
          {isDisplayed && <ScrollBar>{links}</ScrollBar>}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

Storage.propTypes = {}

export default Storage
