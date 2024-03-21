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
    id: 'statusDisplay',
    label: 'Состояние',
    component: BaseCell,
    sizes: 180,
  },
  {
    id: 'performer',
    label: 'Исполнитель',
    component: ({
      ParentValue: {
        performer,
      },
    }) => {
      const fio = `${performer?.lastName} ${
        (performer?.firstName && `${performer?.firstName[0]}.`) || ''
      } ${(performer?.middleName && `${performer?.middleName[0]}.`) || ''}`
      return (
        <BaseSubCell
          value={fio}
          subValue={performer?.position}
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
    component: BaseCell,
    sizes: 361,
  },
]
