import OrgStructureComponentWithTemplateWindowWrapper from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate'
// Для некоторых полей на реквизитах нужно кастомной окно с двумя табави и возможностью выбрать из шаблонов

const fieldNameForCustomWindow = [
  'dsid_sd_branch_curator_empl', //"Куратор филиала по СД"
  'dsid_ea_curator_empl', //"Куратор ИА по ПД"
  'dsid_branch_curator_empl', //"Куратор филиала по ПД"
]

const parsePropsRequisites =
  () =>
  (fieldState) =>
  ({ attr: { dss_attr_name } }) => {
    if (fieldNameForCustomWindow.includes(dss_attr_name)) {
      fieldState.props.WindowComponent =
        OrgStructureComponentWithTemplateWindowWrapper
    }
  }

export default parsePropsRequisites
