import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useMemo } from 'react'
import log from 'tailwindcss/lib/util/log'

const res = {
  r_object_id: '00xxxxxx000004u9',
  dss_middle_name: 'К',
  dss_first_name: 'К',
  dss_messenger: null,
  department_name: 'Департамент 1',
  isReservationRegistrationGM: false,
  position_name: 'Делопроизводитель',
  groups: ['all_creation'],
  sort: [],
  dss_email: null,
  isSettingRegistrationNumberGM: false,
  dss_last_name: 'Клерк1',
  prefs: [],
  administrator: false,
  dsid_avatar: null,
  isParticipantKO: false,
  dss_phone: null,
  branch_id: '00xxxxxx000004u1',
  dss_user_name: 'Clerk1',
  organization: [
    {
      r_object_id: '00xxxxxx000004u0',
      dss_full_name: 'Тестовая организация полное наименование',
      dss_home: 'TEST_ORG',
      dss_name: 'Тестовая организация',
      branches: [],
    },
    {
      r_object_id: '00xxxxxx00000qb9',
      dss_full_name: 'ПАО «Россети Московский регион»',
      dss_home: 'APSD',
      dss_name: 'ПАО «Россети Московский регион»',
      branches: [
        {
          r_object_id: '00xxxxxx00001jx2',
          dss_full_name: 'Тестовый филиал',
          dss_name: 'Тестовый филиал',
        },
      ],
    },
  ],
  isConsistentHelper: false,
}

const ORGANIZATION_FIELD = 'organization'
const BRANCH_FIELD = 'branchId'
// const DEPARTMENT_FIELD = 'organization'

const filterFieldsMap = [ORGANIZATION_FIELD, BRANCH_FIELD]

const filterPrepMap = {
  [ORGANIZATION_FIELD]: ({ value, defaultParam, key, acc }) => {
    acc[key] = value ?? defaultParam
    return acc
  },
  [BRANCH_FIELD]: ({ value, acc, defaultParams, key, defaultParam }) => {
    if (acc.organization !== defaultParams.organization) {
      if (value) {
        acc[key] = value
      }
      return acc
    } else {
      acc[key] = defaultParam
    }

    return acc
  },
}

const useCustomFilterFunc = {
  [ORGANIZATION_FIELD]: false,
  [BRANCH_FIELD]: true,
}

const useDefaultFilter = ({ baseFilter = {} }) => {
  const {
    organization: [{ r_object_id: organization = '', branches }] = [{}],
  } = useRecoilValue(userAtom)

  const defaultParams = useMemo(() => {
    return {
      organization,
      branchId: branches[0]?.r_object_id,
    }
  }, [branches, organization])

  return useMemo(
    () =>
      filterFieldsMap.reduce((acc, key) => {
        const { [key]: value } = baseFilter

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
