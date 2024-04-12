import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ADDITIONAL_AGREEMENT_USER_LIST, URL_ENTITY_LIST } from '@/ApiList'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'
import NumericInput from '@Components/Components/Inputs/NumericInput'
import { integer, required } from '@Components/Logic/Validator'

export const useFormRulesConfig = (visible) =>
  useMemo(() => {
    const rules = {
      name: [{ validatorObject: required }],
      term: [{ validatorObject: integer }, { validatorObject: required }],
    }
    if (visible) {
      rules['show'] = [{ validatorObject: required }]
    }
    return rules
  }, [visible])

export const useFormFieldsConfig = (
  api,
  documentId,
  filterValue,
  typicalStage,
  visible,
) =>
  useMemo(
    () =>
      [
        {
          id: 'name',
          label: 'Наименование',
          component: LoadableSelect,
          required: true,
          placeholder: 'Наименование этапа',
          valueKey: 'dss_name',
          labelKey: 'dss_name',
          className: 'font-size-12',
          options: typicalStage,
          loadFunction: async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              type: 'ddt_dict_typical_stage',
              query,
            })
            return data
          },
        },
        {
          id: 'show',
          component: SearchInput,
          visible: visible,
          multiple: true,
          returnOption: false,
          className: 'font-size-12',
          placeholder: 'Наименование этапа',
          label: 'Наименование этапа',
        },
        {
          id: 'approvers',
          component: AdditionalAgreementOrgStructureComponent,
          loadFunction: (api) => (filter) => async (query) => {
            const { data } = await api.post(
              URL_ADDITIONAL_AGREEMENT_USER_LIST,
              {
                stageCurator: filterValue.stageCurator,
                documentId,
                filter: {
                  ...filter,
                  ...query,
                },
              },
            )
            return data
          },
          multiple: true,
          returnOption: false,
          className: 'font-size-12',
          placeholder: 'Выберите участников',
          label: 'Участники',
        },
        {
          id: 'term',
          component: NumericInput,
          placeholder: 'Срок в рабочих днях',
          label: 'Укажите в рабочих днях',
        },
      ].filter(({ visible }) => visible !== false),
    [api, documentId, filterValue.stageCurator, typicalStage, visible],
  )
