import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import {
  URL_STORAGE_BRANCH,
  URL_STORAGE_DOCUMENT,
  URL_STORAGE_SECTION,
  URL_STORAGE_TITLE,
} from '@/ApiList'
import ArchiveChildrenItem from './ArchiveChildrenItem'
import ArchiveParentItem from './ArchiveParentItem'

const apisMap = {
  0: async ({ api }) => {
    const { data } = await api.post(URL_STORAGE_BRANCH)
    return data
  },
  1: async ({ api, id }) => {
    const { data } = await api.post(URL_STORAGE_TITLE, {
      filter: {
        branchId: id,
      },
    })
    return data
  },
  2: async ({ api, id }) => {
    const { data } = await api.post(URL_STORAGE_SECTION, {
      filter: {
        titleId: id,
      },
    })
    return data
  },
}

const ArchiveItem = ({ parentName, level, id, onOpenNewTab }) => {
  const [items, setItems] = useState([])
  const api = useContext(ApiContext)
  useEffect(() => {
    ;(async () => {
      setItems(await apisMap[level]({ api, id }))
    })()
  }, [api, level, id])

  return items.map(
    level === 2
      ? (props) => (
          <ArchiveChildrenItem
            {...props}
            onOpenNewTab={onOpenNewTab}
            key={props.id}
          />
        )
      : ({ id, name }) => (
          <ArchiveParentItem
            key={id}
            id={id}
            name={name}
            parentName={parentName}
            level={level}
            onOpenNewTab={onOpenNewTab}
          >
            <div className="flex flex-col pl-4">
              <ArchiveItem
                level={level + 1}
                id={id}
                parentName={name}
                onOpenNewTab={onOpenNewTab}
              />
            </div>
          </ArchiveParentItem>
        ),
  )
}

ArchiveItem.propTypes = {
  level: PropTypes.number,
  id: PropTypes.string,
  onOpenNewTab: PropTypes.func.isRequired,
}

ArchiveItem.defaultProps = {
  level: 0,
  parentName: 123123,
}

export default ArchiveItem
