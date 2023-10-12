import { disabledVerification } from './constants'
import { useMemo, useRef } from 'react'

// базовое состояние рефы
const defaultRefState = {
  disableMap: new Map(), // состояния disabled посчитанные для прошлого рендера
  fields: new Map(), // копия полей с посчитанным состоянием disabled
  prevFields: new Map(), // значение мапы полей с прошлого рендера
}

// соопостовление двух мап состояния disabled
const compareResult = (disableMap, prevDisableMap) => {
  let result = true
  disableMap.forEach((value, key) => {
    if (prevDisableMap.get(key) !== value) {
      result = false
    }
  })

  return result
}

const disabledStage = (state) => {
  if (!state[disabledVerification]) {
    state[disabledVerification] = new Map() // проверки disabled состояния полей
    // поля не управляют своми состояними, состояния до рендера формы
    state.formPropsHooks.push(({ fields, value }) => {
      const prefCalc = useRef(defaultRefState)
      return {
        fields: useMemo(() => {
          const {
            prevFields,
            disableMap: prevDisableMap,
            fields: prevCalcFields,
          } = prefCalc.current // читаем прошлый стейт
          const fieldsCopy = new Map(fields) // копируем поля для работы с ними
          const disableMap = new Map() // новая мапа состояний disabled
          state[disabledVerification].forEach((condition, key) => {
            const examinationResult = Array.isArray(condition) // вычисляем состояние disabled
              ? condition.some((c) => c(value)) // хотя бы одно из условий disabled = true
              : condition(value)
            disableMap.set(key, examinationResult) // записываем в мапу расчет
            // прописываем в поле результат только при условии, что оно задизейбленно, там уже может быть тру
            if (examinationResult) {
              fieldsCopy.set(key, {
                ...fieldsCopy.get(key),
                disabled: examinationResult,
              })
            }
          })
          // оптимизация, если мапа полей не поменялась и расчет не изменился, возвращаем предидущий расчет для сокращения
          // ререндеров формы
          if (
            prevFields === fields &&
            compareResult(disableMap, prevDisableMap)
          ) {
            return prevCalcFields
          }

          // обновляем объект прошлых состояний
          prefCalc.current = {
            disableMap,
            fields: fieldsCopy,
            prevFields: fields,
          }

          return fieldsCopy
        }, [fields, value]),
      }
    })
  }

  return (key, handler) => {
    state[disabledVerification].set(
      key,
      // обрабатываем возможность добавления нескольких условий disabled на поле
      state[disabledVerification].has(key)
        ? [state[disabledVerification].get(key), handler]
        : handler,
    )
  }
}

// Это функционал реквизитов, реализовать там
// if (disabled.length > 0 && allowedSaveByPermits) {

export default disabledStage
