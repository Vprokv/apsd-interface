import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useMemo } from 'react'

const ORGANIZATION_FIELD = 'organizationId'
const BRANCH_FIELD = 'branchId'
const SOURCE = 'source'
// const DEPARTMENT_FIELD = 'organization'

const filterFieldsMap = [ORGANIZATION_FIELD, BRANCH_FIELD, SOURCE]

const filterPrepMap = {
  [ORGANIZATION_FIELD]: ({ value, defaultParam, key, acc }) => {
    acc[key] = value ?? defaultParam
    return acc
  },
  [BRANCH_FIELD]: ({ value, acc, key, defaultParam }) => {
    if (value) {
      acc[key] = value
      // }
      return acc
    } else {
      acc[key] = defaultParam
    }

    return acc
  },
  [SOURCE]: ({ value, key, acc }) => {
    if (value) {
      acc[key] = value
    }
    return acc
  },
}

const useCustomFilterFunc = {
  [SOURCE]: true,
  [ORGANIZATION_FIELD]: false,
  [BRANCH_FIELD]: true,
}

const useDefaultFilter = ({ baseFilter }) => {
  const {
    organization: [{ r_object_id: organizationId = '', branches }] = [{}],
  } = useRecoilValue(userAtom)

  const defaultParams = useMemo(() => {
    return {
      organizationId,
      branchId: branches[0]?.r_object_id,
    }
  }, [branches, organizationId])

  return useMemo(
    () =>
      filterFieldsMap.reduce((acc, key) => {
        const { [key]: value } = baseFilter || {}

        return value || useCustomFilterFunc[key]
          ? filterPrepMap[key]({
              baseFilter,
              value,
              acc,
              defaultParams,
              key,
              defaultParam: defaultParams[key],
            })
          : (() => {
              acc[key] = defaultParams[key]
              return acc
            })()
      }, {}),
    [baseFilter, defaultParams],
  )
}

export default useDefaultFilter
