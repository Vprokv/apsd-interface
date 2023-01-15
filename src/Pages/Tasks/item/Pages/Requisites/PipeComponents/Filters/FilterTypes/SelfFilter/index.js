import ReferenceFilter from './ReferenceFilter'
import { URL_ORGSTURCTURE_ORGANIZATIONS } from '@/ApiList'

const ORGANIZATION_FILTER = 'organization'

const map = {
  Orgstructure: {
    [ORGANIZATION_FILTER]: async (api) => {
      const { data } = await api.post(URL_ORGSTURCTURE_ORGANIZATIONS)
      return data
    },
    defaultFunc: (api, id) => [
      {
        r_object_id: id,
        dss_name: id,
      },
    ],
  },
}

const WithDependsOnFilter = ({ nextProps, type }, filters) => {
  nextProps.component = ReferenceFilter(
    nextProps.component,
    filters,
    map[type],
    type,
  )
  if (!nextProps.filter) {
    nextProps.filter = {}
  }
  filters.forEach(({ filter, field }) => {
    if (filter) {
      nextProps.filter[field] = filter
    }
  })
}
export default WithDependsOnFilter
