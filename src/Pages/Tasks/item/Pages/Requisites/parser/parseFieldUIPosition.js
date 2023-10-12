import CreateFieldStage from '@/Utils/Parser/Stages/CreateFieldStage'

const parseFieldUIPosition = (state) => (args) => {
  const { col, row, width, height } = args
  const field = CreateFieldStage(state)(args)

  field.style = {
    ...field.style,
    gridColumn: `${col + 1}/${col + width + 1}`,
    gridRow: `${row + 1}/${row + height + 1}`,
    height: height > 1 ? '100%' : undefined,
  }
}

export default parseFieldUIPosition
