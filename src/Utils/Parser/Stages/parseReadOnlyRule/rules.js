export const ReadOnlyIf = (key, values) =>
  `obj.${key} === ${values.startsWith('$') ? values.slice(1) : `"${values}"`}`
export const ReadOnlyIfNot = (key, values) =>
  `obj.${key} !== ${values.startsWith('$') ? values.slice(1) : `"${values}"`}`
export const ReadOnly = () => 'true'

export const readOnlyRules = {
  readonly_if: ReadOnlyIf,
  readonly_if_not: ReadOnlyIfNot,
  readonly: ReadOnly,
}
