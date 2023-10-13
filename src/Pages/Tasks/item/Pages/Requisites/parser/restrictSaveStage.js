import CreateFieldStage from '@/Utils/Parser/Stages/CreateFieldStage'
// запрещаем менять значения полей всегда. хук связан с правами вкладки реквизиты
const restrictSaveStage = (state) => (args) => {
  CreateFieldStage(state)(args).disabled = true
}

export default restrictSaveStage
