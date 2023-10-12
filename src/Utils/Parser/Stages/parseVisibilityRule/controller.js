/* eslint-disable react-hooks/rules-of-hooks */
import { visibleRules } from './rules'
import { useMemo, useRef } from 'react'
import { visibleVerification } from './constants'
import { disabledStage } from '@/Utils/Parser/Stages/DisabledStage'

// базовое состояние рефы
const defaultRefState = {
  removedList: [], // удаленные поля посчитанные для прошлого рендера
  fields: new Map(), // копия полей с посчитанным состоянием disabled
  prevFields: new Map(), // значение мапы полей с прошлого рендера
}

const parseVisibilityRule = (state) => {
  const addDisabledRule = disabledStage(state) // инициализируем disabled проверки для полей
  if (!state[visibleVerification]) {
    state[visibleVerification] = new Map() // проверки disabled состояния полей
  }
  // поля не управляют своми состояними, определяем список полей и их состояния до рендера формы
  state.formPropsHooks.push(({ fields, value }) => {
    const prefCalc = useRef(defaultRefState)
    return {
      fields: useMemo(() => {
        const {
          prevFields,
          removedList: prevRemovedList,
          fields: prevCalcFields,
        } = prefCalc.current // читаем прошлый стейт
        const fieldsCopy = new Map(fields) // копируем поля для работы с ними
        const removedList = [] // новый список удаленных полей

        state[visibleVerification].forEach((condition, key) => {
          if (!condition(value)) {
            removedList.push(key)
            fieldsCopy.delete(key)
          }
        })

        // оптимизация, если мапа полей не поменялась и расчет не изменился, возвращаем предидущий расчет для сокращения
        // ререндеров формы
        if (
          prevFields === fields &&
          removedList.length === prevRemovedList.length &&
          removedList.every((c, i) => c === prevRemovedList[i])
        ) {
          return prevCalcFields
        }

        // обновляем объект прошлых состояний
        prefCalc.current = {
          removedList,
          fields: fieldsCopy,
          prevFields: fields,
        }

        return fieldsCopy
      }, [fields, value]),
    }
  })
  return ({ attr: { dss_visible_rule, dss_attr_name } }) => {
    if (dss_visible_rule) {
      // парсим условие отображения поля
      const { args, condition, disabled } = dss_visible_rule
        .match(/[^&|]+|(&|\||.)\b/gm)
        .reduce(
          (acc, condition, i) => {
            if (i % 2 === 1) {
              acc.condition = `${acc.condition} ${condition}${condition}`
            } else {
              const [rule, id, ...values] = condition.match(/[^:,[\]\s$]+/gm)
              const { condition: ruleCondition, disabled } = visibleRules[rule](
                id,
                values,
              )

              acc.condition = `${acc.condition} ${ruleCondition}`
              if (disabled) {
                acc.disabled.push(disabled)
              }
              acc.args.add(id)
            }
            return acc
          },
          { condition: '', disabled: [], args: new Set() },
        )
      state[visibleVerification].set(
        dss_attr_name,
        // создаем функцию проверки рендера поля
        new Function(`{${[...args].join(',')}} = {}`, `return ${condition}`),
      )

      // если у поля есть условие disabled, добавляем функцию из правила
      if (disabled.length > 0) {
        disabled.forEach((d) => addDisabledRule.set(...d))
      }
    }
  }
}

export default parseVisibilityRule
