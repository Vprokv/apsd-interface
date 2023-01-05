import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useMemo } from 'react'

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

const useDefaultFilter = ({ source, docId }) => {
  const {
    organization: [{ r_object_id: organization = '', branches }] = [{}],
  } = useRecoilValue(userAtom)

  return useMemo(() => {
    const obj = {}

    if (organization) {
      obj['organization'] = organization
    }

    if (branches[0]?.r_object_id) {
      obj['branchId'] = branches[0]?.r_object_id
    }

    if (docId) {
      obj['docId'] = docId
    }

    if (source) {
      obj['source'] = source
    }

    return obj
  }, [organization, branches, docId, source])
}

export default useDefaultFilter
