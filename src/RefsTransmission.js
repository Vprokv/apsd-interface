const refsMap = {
  "ddt_dict_titul": {
    valueKey: "r_object_id",
    labelKey: "dss_name"
  },
  "ddt_organization": {
    valueKey: "r_object_id",
    labelKey: "dss_name"
  },
  "ddt_dict_titul_type": {
    valueKey: "r_object_id",
    labelKey: "dss_name"
  },
  "ddt_dict_stamp": {
    valueKey: "r_object_id",
    labelKey: "dss_name"
  },
}

const defaultObject = { valueKey: "r_object_id", labelKey: "dss_name"}
const refsTransmission = (refKey) => refsMap[refKey] || defaultObject
export default refsTransmission

