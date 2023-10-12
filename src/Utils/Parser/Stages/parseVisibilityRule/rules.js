export const VisibleIf = (key, values) => ({
  condition: `${key} === "${values[0]}"`,
})
export const VisibleIn = (key, values) => ({
  condition: `[${values.reduce(
    (acc, v) => (acc ? `${acc},"${v}"` : `"${v}"`),
    '',
  )}].includes(${key})`,
})
export const StaticVisibleIf = (key, values) => ({
  condition: `${key} === "${values[0]}"`,
  disabled: [[key], () => true],
})
export const VisibleIfNull = (key) => ({ condition: `!${key}` })
export const VisibleIfNotNull = (key) => ({ condition: `!!${key}` })

export const visibleRules = {
  visible_if: VisibleIf,
  visible_in: VisibleIn,
  static_visible_if: StaticVisibleIf,
  visible_if_null: VisibleIfNull,
  visible_if_not_null: VisibleIfNotNull,
}
