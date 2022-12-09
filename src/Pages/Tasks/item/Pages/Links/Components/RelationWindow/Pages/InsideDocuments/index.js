import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CreateRelationTable from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/CreateRelationTable'
import {
  StateContext,
  UpdateContext,
} from '@/Pages/Tasks/item/Pages/Links/constans'
import { useParams } from 'react-router-dom'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT_OTHER,
  INSIDE_DOCUMENT_WINDOW,
  PRESENT_DATE_FORMAT,
  SEARCH_PAGE,
} from '@/contants'
import { URL_LINK_CREATE } from '@/ApiList'
import SearchComponent from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments/Сomponents/SearchComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'
import log from 'tailwindcss/lib/util/log'
import dayjs from 'dayjs'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'

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
  const parentId = useContext(DocumentIdContext)
  const close = useContext(StateContext)
  const update = useContext(UpdateContext)

  const tabItemState = useTabItem({
    stateId: INSIDE_DOCUMENT_WINDOW,
  })

  const {
    tabState: { selected = [], value = [] },
    setTabState,
  } = tabItemState

  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)

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
          regDate: dayjs(
            valuesCustom.r_creation_date,
            DEFAULT_DATE_FORMAT_OTHER,
          ).format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
          description: valuesCustom.dss_description,
          authorEmpl: r_object_id,
          authorName: dss_user_name,
          stageName: valuesCustom.dss_status.dss_name,
          comment,
          linkType,
        }
      }),
    [dss_user_name, parentId, r_object_id, value],
  )

  const onCreate = useCallback(async () => {
    await api.post(URL_LINK_CREATE, { linkObjects })
    update()
    close()
    updateTabState('value')([])
    updateTabState('filter')({ type: 'ddt_project_calc_type_doc' })
  }, [api, close, linkObjects, update, updateTabState])

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
