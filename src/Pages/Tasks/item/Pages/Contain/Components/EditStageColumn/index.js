import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'

const EditStageColumn = ({ className, value, onInput, ParentValue }) => {
  const api = useContext(ApiContext)
  return (
    <LoadableSelect
      id="approveLevel"
      className={className}
      loadFunction={useCallback(
        async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tom_stage',
            query,
          })
          return data
        },
        [api],
      )}
      valueKey="dss_name"
      labelKey="dss_name"
      value={useMemo(() => (value ? { dssName: value } : undefined), [value])} // из api приходит строчка label
      returnObjects
      onInput={useCallback(
        (value, id) => onInput(value.r_object_id, id, ParentValue), // на бэк отправляем Id-шку
        [ParentValue, onInput],
      )}
    />
  )
}

EditStageColumn.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onInput: PropTypes.func.isRequired,
  ParentValue: PropTypes.object,
}

export default EditStageColumn
