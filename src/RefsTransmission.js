const refsMap = {
  ddt_startup_complex_type_doc: {
    valueKey: 'r_object_id',
    labelKey: 'dss_description',
  },
  ddt_document_status: {
    valueKey: 'dss_name',
    labelKey: 'dss_caption',
  },
  Branch: {
    valueKey: 'id',
    labelKey: 'name',
  },
  Department: {
    valueKey: 'dsid_departmen',
    labelKey: 'dss_department_name',
  },
  TitleDocument: {
    valueKey: 'id',
    labelKey: 'description',
  },
}

const defaultObject = { valueKey: 'r_object_id', labelKey: 'dss_name' }
const refsTransmission = (refKey) => refsMap[refKey] || defaultObject
export default refsTransmission
