import { useMemo } from 'react'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'

const addUserFullNameInOptionsStage = () => (fieldState) => () => {
  fieldState.hooks.push(({ options }) => {
    return {
      options: useMemo(
        () => (options || []).map(AddUserOptionsFullName),
        [options],
      ),
    }
  })
}

export default addUserFullNameInOptionsStage
