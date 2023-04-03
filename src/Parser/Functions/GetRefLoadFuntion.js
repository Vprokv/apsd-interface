import { URL_ENTITY_LIST } from '@/ApiList'

export default ({
    backConfig: {
      dss_component_reference,
      dss_attr_name,
      dss_reference_attr_label = 'dss_name',
      dss_reference_attr = 'r_object_id',
    },
    api,
  }) =>
  (nextProps) => {
    if (dss_component_reference) {
      nextProps.loadFunction = (filters) => async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          id: dss_attr_name,
          type: dss_component_reference,
          query,
          // filter: query
          // ? {
          //     query,
          //   }
          // : {}, //TODO тут непонятно как передавать query корректно, оставила как работает
          filters,
        })
        return data
      }
      nextProps.valueKey = dss_reference_attr
      nextProps.labelKey = dss_reference_attr_label
      nextProps.refKey = dss_component_reference
    }
    return nextProps
  }
