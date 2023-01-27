import ReferenceFilter from './ReferenceFilter'
import {
  URL_ORGSTURCTURE_BRANCHES,
} from '@/ApiList'

const BRANCH_ID_FILTER = 'branchId'
const ORGANIZATION_FILTER = 'organization'

const map = {
  Orgstructure: {
    [BRANCH_ID_FILTER]: async (api, a, configFilter) => {
      const field = configFilter.find(
        ({ field }) => field === ORGANIZATION_FILTER,
      )
      const { data } = await api.post(URL_ORGSTURCTURE_BRANCHES, {
        id: field.filter,
      })
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

const WithDependsOnFilter = (
  { nextProps, type, interceptors, backConfig },
  filters,
) => {
  nextProps.component = ReferenceFilter(
    nextProps.component,
    filters,
    map[type],
    type,
    backConfig.filters,
  )

  filters.forEach(({ field }) => {
    if (!interceptors.has(field)) {
      interceptors.set(field, [])
    }
    interceptors.get(field).push(backConfig.dss_attr_name)
  })
}
export default WithDependsOnFilter
