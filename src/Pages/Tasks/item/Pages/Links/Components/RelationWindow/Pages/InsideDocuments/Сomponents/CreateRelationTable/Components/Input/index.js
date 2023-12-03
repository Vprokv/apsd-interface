import { useContext } from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import { StateRelationContext } from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/constans'

const LinkType = ({ ParentValue: { id } }) => {
  const api = useContext(ApiContext)
  const { linkType, onLink } = useContext(StateRelationContext)
  const loadFunction = async (query) => {
    const { data } = await api.post(URL_ENTITY_LIST, {
      type: 'ddt_dict_link_type',
      query,
    })
    return data
  }

  return (
    <LoadableSelect
      value={(linkType.has(id) && linkType.get(id)) || ''}
      onInput={onLink(id)}
      placeholder="Укажите тип связи"
      valueKey="r_object_id"
      labelKey="dss_name"
      loadFunction={loadFunction}
    />
  )
}

LinkType.propTypes = {
  ParentValue: PropTypes.object,
}

export default LinkType
