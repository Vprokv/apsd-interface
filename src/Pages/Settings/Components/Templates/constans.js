import React from 'react'

export const TemplateTabStateContext = React.createContext({
  onInput: () => null,
  values: {},
})

export const parseSettingsFuncMap = {
  user: () => ({ privateAccess: true }),
  organization: () => ({ allAccess: true }),
  department: ({ branchesAccess }) => ({ branchesAccess }),
  employee: ({ usersAccess }) => ({
    usersAccess: usersAccess?.map((val) => ({ emplId: val, val })),
  }),
}
