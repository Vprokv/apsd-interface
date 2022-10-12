import {useRecoilValue} from "recoil";
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'

const useDefaultFilter = () => {
  const {
    organization: [{
      r_object_id: organization = "",
      branches: [{r_object_id: branchId = ""}] = [{}]
    }] = [{}],
  } = useRecoilValue(userAtom)

  return {
    branchId,
    organization
  }
}

export default useDefaultFilter