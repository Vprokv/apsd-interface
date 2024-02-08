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
    header: 'Дата создания тома',
    path: 'tomCreationDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Даты разработки (план)',
    path: 'plannedDevDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Даты разработки (факт)',
    path: 'actualDevDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата согласования (план)',
    path: 'plannedApproveDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата согласования (факт)',
    path: 'actualApproveDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Начало проектирования по договору',
    path: 'designDateFrom',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Окончание проектирования по договору',
    path: 'designDateTo',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Стадия',
    path: 'tomStage',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Этап(результат)',
    path: 'tomStageResult',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Состояние(результат)',
    path: 'statusResult',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата(результат)',
    path: 'finishDate',
  },
]
