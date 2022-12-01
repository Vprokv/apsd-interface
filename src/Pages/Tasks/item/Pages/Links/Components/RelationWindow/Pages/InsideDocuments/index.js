import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CreateRelationTable from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable'
import {StateContext, UpdateContext} from '@/Pages/Tasks/item/Pages/Links/constans'
import { useParams } from 'react-router-dom'
import { ApiContext, INSIDE_DOCUMENT_WINDOW, SEARCH_PAGE } from '@/contants'
import { URL_LINK_CREATE } from '@/ApiList'
import SearchComponent from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/SearchComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'

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
  const { id: parentId } = useParams()
  const close = useContext(StateContext)
  const update = useContext(UpdateContext)

  const tabItemState = useTabItem({
    stateId: INSIDE_DOCUMENT_WINDOW,
  })

  const {
    tabState: { selected = [], value = [] },
    setTabState,
  } = tabItemState

  const updateTabState = useCallback(
    (id) => (state) => {
      setTabState({ [id]: state })
    },
    [setTabState],
  )

  const linkObjects = useMemo(
    () =>
      value.map(({ id, comment, linkType, type, valuesCustom }) => {
        return {
          parentId,
          childId: id,
          documentType: type,
          regNumber: valuesCustom.dss_reg_number,
          // regDate: valuesCustom.r_creation_date,
          regDate: "30.11.2022 15:26:00", //TODO
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
    update()
    close()
  }, [api, linkObjects])

  const onSelect = useCallback(
    () => updateTabState('value')(selected),
    [selected, updateTabState],
  )
  const clear = useCallback(() => updateTabState('value')([]), [updateTabState])

  return (
    <>
      <div className="flex flex-col overflow-hidden h-full">
        {!value.length && (
          <ScrollBar className="my-4">
            <SearchComponent
              tabItemState={tabItemState}
              updateTabState={updateTabState}
            />
          </ScrollBar>
        )}
        <CreateRelationTable
          selected={selected}
          setLink={updateTabState('value')}
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
