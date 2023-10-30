import React from 'react'

export const LoadContainChildrenContext = React.createContext({})
export const ShowContentByTypeButtonContext = React.createContext(() => null)

export const columnMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Наименование',
    path: 'name',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Связь',
    path: 'linkName',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор',
    path: 'author',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Шифр',
    path: 'regNumber',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Состояние раздела/тома',
    path: 'status',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Результат',
    path: 'result',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Стадия',
    path: 'tomStage',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Даты разраб.(план/факт)',
    path: '[plannedDevDate,actualDevDate]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата сог.(план/факт)',
    path: '[plannedApproveDate,actualApproveDate]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Просрочка проектировщика',
    path: 'delayDevelopmentDay',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Просрочка согласования',
    path: 'delayApprovalDay',
  },
]
