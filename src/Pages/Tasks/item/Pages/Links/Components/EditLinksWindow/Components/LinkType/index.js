import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import { EditLinkContext } from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/constans'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const LinkType = ({ ParentValue: { contentId, linkType } }) => {
  const api = useContext(ApiContext)
  const { link, onLink } = useContext(EditLinkContext)
  const getNotification = useOpenNotification()

  const loadFunction = async (query) => {
    try {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_link_type',
        query,
      })
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }

  const value = useMemo(
    () => (link.has(contentId) && link.get(contentId)) || linkType,
    [contentId, link, linkType],
  )

  return (
    <LoadableSelect
      value={value}
      onInput={onLink()(contentId)}
      placeholder="Укажите тип связи"
      valueKey="r_object_id"
      labelKey="dss_name"
      loadFunction={loadFunction}
      options={[
        {
          dss_name: linkType,
          r_object_id: linkType,
        },
      ]}
    />
  )
}

LinkType.propTypes = {
  ParentValue: PropTypes.object,
}

export default LinkType
