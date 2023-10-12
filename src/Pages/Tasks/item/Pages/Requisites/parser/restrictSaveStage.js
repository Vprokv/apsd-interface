import CreateFieldStage from '@/Utils/Parser/Stages/CreateFieldStage'

const restrictSaveStage = (state) => (args) => {
  CreateFieldStage(state)(args).disabled = true
}

export default restrictSaveStage
