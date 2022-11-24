import { useCallback, useContext, useMemo } from 'react'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import { ApiContext } from '@/contants'
import { URL_SEARCH_LIST } from '@/ApiList'
import log from 'tailwindcss/lib/util/log'

const searchValues = [
  {
    type: 'ddt_project_calc_type_doc', // - системный тип
    id: '00xxxxxx00007zvw', // - id документа
    globalId: null,
    values: {
      r_object_id: '0000000200037r0s',
      r_creator_name: 'Autotest1',
      dss_signature_finish_parameter: 'waitFirst',
      dss_addressee_branch: null,
      i_deleted: false,
      dsb_5_days_before_overdue: false,
      dsb_common_folder: false,
      dsdt_creation_date: '20.10.2022 15:31',
      i_global_id: '0000000200037r0s',
      dsb_important: false,
      r_modifier_name: 'Autotest1',
      dss_type_label: 'Исходящие документы',
      dss_description: 'Новое описание',
      dsb_has_resolutions: false,
      dss_addressee_organization: null,
      dss_work_number: 'ВР-2341',
      dsi_number_of_page: 0,
      dss_status: 'new',
      dsid_policy: '00xxxxxx0000059t',
      dsi_number_of_appendix: 0,
      dsdt_reg_date: null,
      dss_status_display: 'Новый',
      dss_document_type: 'ddt_outcoming_type_doc',
      dsb_required_addressee: true,
      dss_home_display: 'ASUD_FSK',
      r_creation_date: '15:31 20.10.2022',
      dsb_deffered_send: false,
      dsid_classification_display: 'Исходящие документы',
      dss_signer_branch: 'Тестовый филиал ФСК',
      dsid_classification: '00xxxxxx000006iq',
      dsb_overdue_resolution_exists: false,
      dsid_document_kind_display: 'Исходящий документ',
      dss_reg_number: 'ВР-2341',
      dsid_stamp: '00xxxxxx000003rm',
      dsb_blank: false,
      dss_home: 'ASUD_FSK',
      dsb_deleted: false,
      dsb_10_days_before_overdue: false,
      r_modify_date: '15:31 20.10.2022',
      dsb_claim: false,
      dss_signer_organization: 'ПАО "ФСК ЕЭС"',
      dsi_rework_period: 0,
      dss_approve_finish_parameter: 'waitFirst',
      dsdt_dispatch_date: null,
      dsid_document_kind: '00000002000021gg',
      dss_color_css: '#000000',
      dsid_stamp_display: 'Общего пользования',
      dsb_procedural: false,
    },
    valuesCustom: {
      dss_note: null,
      dsb_5_days_before_overdue: false,
      dsb_common_folder: false,
      dsdt_creation_date: '20.10.2022 15:31',
      dss_paper_version_location: null,
      dss_work_number: 'ВР-2341',
      dsid_author_empl: {
        // - автор документа
        emplId: '00xxxxxx000012ba',
        userName: 'Autotest1',
        position: 'Сотрудник',
        department: 'Департамент 1',
        organization: 'ПАО "ФСК ЕЭС"',
        branch: 'Тестовый филиал ФСК',
        avatartId: null,
        firstName: 'А',
        lastName: 'Автотест1',
        middleName: 'Т',
        email: null,
        phone: null,
        isFederated: false,
        positionLevel: null,
        positionLevelName: null,
        inactive: null,
        fullDescription: null,
      },
      dsi_number_of_page: 0,
      dsid_ztp: null,
      dsid_link_incoming: null,
      dss_status: 'Новый',
      dsid_policy: '00xxxxxx0000059t',
      dsi_number_of_appendix: 0,
      dsdt_reg_date: null,
      dsid_addresse_type: null,
      r_creation_date: '15:31 20.10.2022',
      dsid_executor_empl: {
        emplId: '00xxxxxx000012ba',
        userName: 'Autotest1',
        position: 'Сотрудник',
        department: 'Департамент 1',
        organization: 'ПАО "ФСК ЕЭС"',
        branch: 'Тестовый филиал ФСК',
        avatartId: null,
        firstName: 'А',
        lastName: 'Автотест1',
        middleName: 'Т',
        email: null,
        phone: null,
        isFederated: false,
        positionLevel: null,
        positionLevelName: null,
        inactive: null,
        fullDescription: null,
      },
      dsid_classification: '00xxxxxx000006iq',
      dsb_overdue_resolution_exists: false,
      dsid_document_kind_display: 'Исходящий документ',
      dsid_agent_person: {
        dsidAgentOrPerson: null,
        firstName: null,
        lastName: 'Автотест3',
        middleName: 'Т.',
        dsidAgent: '000000020001ghfc',
        dsidAgentPerson: '000000020001ghfd',
        dssPersonFio: null,
        dssPersonPosition: '-',
        dssAgentName: 'Автотест3 А. Т.',
        dssAgentAddress: null,
        dssPhone: null,
        dsbIndividual: false,
        dsbNotActive: false,
        codeNum: null,
        foiv: null,
        dssKpp: null,
        dssInn: null,
        organization: 'Автотест3 А. Т.',
        dssAgentCode: null,
        attrName: null,
        docId: null,
        branch: null,
        folderId: null,
        agentFolderBranch: null,
        email: null,
        mailingSentDate: null,
        mailingStatusName: null,
        dssAgentType: null,
      },
      dsid_dtp: null,
      dss_approve_finish_parameter: 'waitFirst',
      dsdt_dispatch_date: null,
      dss_barcode: null,
      dsid_document_kind: 'Исходящий документ',
      dsid_stamp_display: 'Общего пользования',
      dsb_procedural: false,
      r_object_id: '0000000200037r0s',
      r_creator_name: 'Autotest1',
      drid_addressee_empl: [],
      dss_signature_finish_parameter: 'waitFirst',
      dss_addressee_branch: null,
      i_deleted: false,
      dsid_approver_empl: [],
      dss_document_source: null,
      dsid_vrio_empl: [],
      i_global_id: '0000000200037r0s',
      dsb_important: false,
      dsid_signer_empl: {
        emplId: '00xxxxxx000012bv',
        userName: 'Autotest2',
        position: 'Сотрудник',
        department: 'Департамент 2',
        organization: 'ПАО "ФСК ЕЭС"',
        branch: 'Тестовый филиал ФСК',
        avatartId: null,
        firstName: 'А',
        lastName: 'Автотест2',
        middleName: 'Т',
        email: null,
        phone: null,
        isFederated: false,
        positionLevel: null,
        positionLevelName: null,
        inactive: null,
        fullDescription: null,
      },
      r_modifier_name: 'Autotest1',
      dss_type_label: 'Исходящие документы', // - тип документа
      dss_description: 'Новое описание', // - описание документа
      dsb_has_resolutions: false,
      dss_addressee_organization: null,
      dsid_dispatch_empl: [],
      dsid_delivery: null,
      dsid_dispatch_sort: null,
      dss_status_display: 'Новый', // - статус документа
      dss_document_type: 'ddt_outcoming_type_doc',
      dss_agent_index: ['Автотест3 А. Т. Автотест3 А. Т.'],
      dsb_required_addressee: true,
      dss_home_display: 'ASUD_FSK',
      dsb_deffered_send: false,
      dsid_classification_display: 'Исходящие документы',
      dss_signer_branch: 'Тестовый филиал ФСК',
      dss_reg_number: 'ВР-2341', // - регномер
      dsid_stamp: 'Общего пользования',
      dsb_blank: false,
      dss_home: 'ASUD_FSK',
      dsb_deleted: false,
      dsb_10_days_before_overdue: false,
      r_modify_date: '15:31 20.10.2022',
      dsb_claim: false,
      dsid_dispatch: null,
      dss_signer_organization: 'ПАО ФСК ЕЭС',
      dsi_rework_period: 0,
      dss_color_css: '#000000',
      state: {
        dss_name: 'Новый',
        r_object_id: 'new',
        nameRu: 'Новый',
        order: null,
        stopParameter: null,
      },
      docState: 'Новый',
      documentActions: null,
      documentTabs: null,
      tags: [],
      highlights: null,
      performers: null,
      attachments: null,
      useContentTemplate: null,
      isFederative: null,
      contentRequired: false,
      deletable: false,
      useForScanning: false,
      waitMimeTypePintCard: null,
      classificationId: '00xxxxxx000006iq',
      approverId: null,
      display: 'Исходящие документы',
      documentColorCss: '#000000',
      isFederativeType: false,
      existsInFolders: false,
      noUnusedQuestions: false,
      dsidSign: null,
      externalCorrespondent: null,
      overdueResolutionExists: false,
      lessThan5DaysOverdueResolutionExists: false,
      lessThan10DaysOverdueResolutionExists: false,
      overdueResolutionNotExists: false,
      showOverdueState: false,
      batchMailId: null,
      dzkParticipantRoles: null,
    },
  },
]

const useButtonFunc = ({
  tabState: { filter = {}, value },
  setTabState,
  operator,
}) => {
  const api = useContext(ApiContext)

  const searchData = useMemo(() => {
    const queryItems =
      !!Object.keys(filter)?.length &&
      Object.keys(filter).reduce((acc, val) => {
        acc.push({
          attr: val,
          operator: operator.get(val)?.ID || "CONTAINS",
          arguments: [filter[val]],
        })
        return acc
      }, [])

    return {
      types: ['ddt_project_calc_type_doc'],
      inVersions: false,
      queryItems,
    }
  }, [filter, value])

  const onSearch = useCallback(async () => {
    const { data } = api.post(URL_SEARCH_LIST, searchData)
    setTabState({ searchValues: data })
    // setTabState({ searchValues })
  }, [api, searchData, setTabState])

  const onRemove = useCallback(() => setTabState({ filter: {} }), [setTabState])

  const functions = {
    search: onSearch,
    delete: onRemove,
  }

  return (key) => functions[key] ?? (() => null)
}

useButtonFunc.defaultProps = {
  filter: {},
  value: '',
  setTabState: () => null,
}

export default useButtonFunc
