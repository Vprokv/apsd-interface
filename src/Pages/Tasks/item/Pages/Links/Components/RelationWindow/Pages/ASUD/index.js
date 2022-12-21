import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import {
  StateContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Links/constans'
import {
  ApiContext,
  ASUD_DOCUMENT_WINDOW,
  INSIDE_DOCUMENT_WINDOW,
} from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_LINK_CREATE } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import CreateRelationTable from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable'
import SearchComponent from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/ASUD/Components/SearchComponent'

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

const DocumentASUD = (props) => {
  const api = useContext(ApiContext)
  const { id: parentId } = useParams()
  const close = useContext(StateContext)
  const update = useContext(UpdateContext)

  const tabItemState = useTabItem({
    stateId: ASUD_DOCUMENT_WINDOW,
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
          regDate: valuesCustom.r_creation_date,
          description: valuesCustom.dss_description,
          authorEmpl: valuesCustom.dsid_author_empl.emplId,
          authorName: valuesCustom.dsid_author_empl.userName,
          stageName: valuesCustom.dss_status,
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

DocumentASUD.propTypes = {}

export default DocumentASUD