import { useOpenNotification } from '@/Components/Notificator'
import { useEffect } from 'react'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

export const useShowErrorAlertOnSubmitFailed = (
  validationState,
  text = 'Заполните обязательные поля',
) => {
  const getNotification = useOpenNotification()
  useEffect(() => {
    if (validationState.hasSubmitted && !validationState.formValid) {
      getNotification(defaultFunctionsMap[412](text))
    }
    // отрабатываем только при смене флага hasSubmitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationState.hasSubmitted])
}
