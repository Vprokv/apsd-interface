import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { SearchComponent } from '@/Pages/Search'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CreateRelationTable from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'
import { StateRelationContext } from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/constans'
import { useParams } from 'react-router-dom'
import { ApiContext } from '@/contants'
import { URL_LINK_CREATE } from '@/ApiList'

const InsideDocument = (props) => {
  const api = useContext(ApiContext)
  const [selected, setSelected] = useState()
  const { id: parentId } = useParams()
  const [value, setValue] = useState([])
  const close = useContext(StateContext)

  const [linkType, setLinkType] = useState(() => new Map())
  const [comment, setComment] = useState(() => new Map())

  const onLink = useCallback(
    (val) => (a) => {
      const prevChecked = new Map(linkType)
      return setLinkType(prevChecked.set(val, a))
    },
    [linkType, setLinkType],
  )
  const onComment = useCallback(
    (val) => (a) => {
      const prevChecked = new Map(comment)
      return setComment(prevChecked.set(val, a))
    },
    [comment, setComment],
  )

  console.log(value, 'value')

  const linkObjects = useMemo(
    () =>
      value.map(({ id, type, values: { dss_reg_number }, valuesCustom }) => {
        return {
          parentId,
          childId: id,
          documentType: type,
          regNumber: valuesCustom.dss_reg_number,
          regDate: valuesCustom.r_creation_date,
          description: valuesCustom.dss_description,
          authorEmpl: valuesCustom.dsid_author_empl.emplId,
          authorName: valuesCustom.dsid_author_empl.userName,
          stageName: valuesCustom.status,
          comment: comment.has(id) && comment.get(id),
          linkType: linkType.has(id) && linkType.get(id),
        }
      }),
    [value, parentId, comment, linkType],
  )

  const onCreate = useCallback(async () => {
    await api.post(URL_LINK_CREATE, { linkObjects })
  }, [api, linkObjects])

  return (
    <StateRelationContext.Provider
      value={{ linkType, onLink, comment, onComment }}
    >
      <div className="flex flex-col overflow-hidden h-full">
        <ScrollBar className="my-4">
          <SearchComponent
            multiple={true}
            setSelected={setSelected}
            selected={selected}
          />
          <CreateRelationTable selected={selected} value={value} />
        </ScrollBar>
      </div>
      {!value.length ? (
        <UnderButtons
          leftFunc={close}
          rightLabel="Добавить связь"
          rightFunc={useCallback(() => setValue(selected), [selected])}
        />
      ) : (
        <UnderButtons
          leftFunc={useCallback(() => setValue([]), [])}
          leftLabel="Вернуться назад"
          rightLabel="Связать"
          rightFunc={onCreate}
        />
      )}
    </StateRelationContext.Provider>
  )
}

InsideDocument.propTypes = {}

export default InsideDocument
