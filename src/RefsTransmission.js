const refsMap = {
  ddt_startup_complex_type_doc: {
    valueKey: 'r_object_id',
    labelKey: 'dss_description',
  },
}

const defaultObject = { valueKey: 'r_object_id', labelKey: 'dss_name' }
const refsTransmission = (refKey) => refsMap[refKey] || defaultObject
export default refsTransmission
