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

const Buttons = ({ value, onSelect, clear, onCreate, close }) =>
  value ? (
    <UnderButtons
      leftFunc={close}
      rightLabel="Добавить связь"
      rightFunc={onSelect}
    />
  ) : (
    <UnderButtons
      leftFunc={clear}
      leftLabel="Вернуться назад"
      rightLabel="Связать"
      rightFunc={onCreate}
    />
  )

const InsideDocument = () => {
  const api = useContext(ApiContext)
  const [selected, setSelected] = useState()
  const { id: parentId } = useParams()
  const [value, setValue] = useState([])
  const close = useContext(StateContext)

  const linkObjects = useMemo(
    () =>
      value.map(({ id, comment, linkType, type, valuesCustom }) => {
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
          comment,
          linkType,
        }
      }),
    [parentId, value],
  )

  const onCreate = useCallback(async () => {
    await api.post(URL_LINK_CREATE, { linkObjects })
  }, [api, linkObjects])

  const onSelect = useCallback(() => setValue(selected), [selected])
  const clear = useCallback(() => setValue([]), [])

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full">
        {!value.length && (
          <ScrollBar className="my-4">
            <SearchComponent
              multiple={true}
              setSelected={setSelected}
              selected={selected}
            />
          </ScrollBar>
        )}
        <CreateRelationTable
          selected={selected}
          setLink={setValue}
          value={value}
        />
      </div>
      <Buttons
        value={!value.length}
        onSelect={onSelect}
        clear={clear}
        onCreate={onCreate}
        close={close}
      />
    </>
  )
}

InsideDocument.propTypes = {}

export default InsideDocument
