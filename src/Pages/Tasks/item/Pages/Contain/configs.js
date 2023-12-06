/* eslint-disable react-hooks/rules-of-hooks */
import TitleNameComponent from '@/Pages/Tasks/item/Pages/Contain/Components/TitleNameComponent'
import ResultCell from '@/Pages/Tasks/item/Pages/Contain/Components/ResultCell'
import DateCell from '@/Pages/Tasks/item/Pages/Contain/Components/DateCell'
import EditStageColumn from './Components/EditStageColumn'
import useCheckIsTomeEditable from './useCheckIsTomeEditable'
import BaseCell from '@/Components/ListTableComponents/BaseCell'

export const columns = ({ updateTomeDevelopmentDateAndStage }) => [
  {
    id: 'name',
    label: 'Наименование',
    className: 'flex font-size-12',
    component: TitleNameComponent,
    sizes: 600,
  },
  {
    id: 'linkName',
    label: 'Связь',
    className: 'flex font-size-12',
  },
  {
    id: 'author',
    label: 'Автор',
    className: 'flex font-size-12',
  },
  {
    id: 'regNumber',
    label: 'Шифр',
    className: 'flex font-size-12',
  },
  {
    id: 'status',
    label: 'Состояние раздела/тома',
    className: 'flex font-size-12',
    sizes: 190,
  },
  {
    id: 'result',
    label: 'Результат',
    component: ResultCell,
    className: 'flex font-size-12',
  },
  {
    id: 'tomStage',
    label: 'Стадия',
    className: 'flex font-size-12',
    component: (props) => {
      const Component = useCheckIsTomeEditable(props.ParentValue)
        ? EditStageColumn
        : BaseCell
      return (
        <Component {...props} onInput={updateTomeDevelopmentDateAndStage} />
      )
    },
  },
  {
    id: 'Даты разраб.(план/факт)',
    label: 'Даты разраб.(план/факт)',
    sizes: 200,
    component: (props) => {
      const {
        ParentValue: { plannedDevDate, actualDevDate },
      } = props
      return (
        <DateCell
          {...props}
          plan={plannedDevDate}
          real={actualDevDate}
          editable={useCheckIsTomeEditable(props.ParentValue)}
          onInput={updateTomeDevelopmentDateAndStage}
        />
      )
    },
  },
  {
    id: 'Дата согл.(план/факт)',
    label: 'Дата сог.(план/факт)',
    sizes: 200,
    component: ({ ParentValue: { plannedApproveDate, actualApproveDate } }) => (
      <DateCell plan={plannedApproveDate} real={actualApproveDate} />
    ),
  },
  {
    id: 'delayDevelopmentDay',
    label: 'Просрочка проектировщика',
    className: 'flex font-size-12',
    sizes: 180,
  },
  {
    id: 'delayApprovalDay',
    label: 'Просрочка согласования',
    className: 'flex font-size-12',
    sizes: 180,
  },
]
