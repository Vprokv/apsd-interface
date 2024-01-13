import BaseCell from '@/Components/ListTableComponents/BaseCell'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'

export const columnsLifeCycleHistory = [
  {
    id: 'stageTypeDisplay',
    label: 'Событие',
    component: BaseCell,
    sizes: 150,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'iteration',
    label: 'Итерация',
    component: BaseCell,
    sizes: 80,
  },
  {
    id: 'eventStatus',
    label: 'Состояние',
    component: ({ ParentValue: { eventStatus } }) => (
      <BaseCell value={eventStatus} className="flex items-center" />
    ),
    sizes: 180,
  },
  {
    id: 'performer',
    label: 'Исполнитель',
    component: ({
      ParentValue: {
        performer: { lastName = '', firstName, middleName, position },
      },
    }) => {
      const fio = `${lastName} ${(firstName && `${firstName[0]}.`) || ''} ${
        (middleName && `${middleName[0]}.`) || ''
      }`
      return (
        <BaseSubCell
          value={fio}
          subValue={position}
          className="flex items-center"
        />
      )
    },
    sizes: 250,
  },
  {
    id: 'initDate',
    label: 'Дата получения',
    component: BaseCell,
    sizes: 170,
  },
  {
    id: 'decisionDate',
    label: 'Дата начала работы',
    component: BaseCell,
    sizes: 170,
  },
  {
    id: 'executionDate',
    label: 'Дата окончания работы',
    component: BaseCell,
    sizes: 170,
  },
  {
    id: 'description',
    label: 'Описание',
    component: ({ ParentValue: { description } }) => (
      <BaseCell value={description} className="flex items-center" />
    ),
    sizes: 361,
  },
]
