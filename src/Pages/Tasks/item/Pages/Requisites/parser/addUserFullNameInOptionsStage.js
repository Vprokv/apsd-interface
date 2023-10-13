import { useMemo } from 'react'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'
// нормализуем статичные опции как в Orgstructure
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
