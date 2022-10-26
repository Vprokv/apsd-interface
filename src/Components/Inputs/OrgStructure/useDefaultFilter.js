import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useMemo } from 'react'

const useDefaultFilter = ({ source, docId }) => {
  const {
    organization: [
      {
        r_object_id: organization,
        branches: [{ r_object_id: branchId }] = [{}],
      },
    ] = [{}],
  } = useRecoilValue(userAtom)

  return useMemo(() => {
    const obj = {}

    if (organization) {
      obj['organization'] = organization
    }

    if (branchId) {
      obj['branchId'] = branchId
    }

    if (docId) {
      obj['docId'] = docId
    }

    if (source) {
      obj['source'] = source
    }

    return obj
  }, [organization, branchId, docId, source])
}

export default useDefaultFilter
