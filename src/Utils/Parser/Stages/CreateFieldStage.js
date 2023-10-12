const CreateFieldStage =
  (state) =>
  ({ attr: { dss_attr_name } }) => {
    if (!state.fields.has(dss_attr_name)) {
      state.fields.set(dss_attr_name, {})
    }

    return state.fields.get(dss_attr_name)
  }

export default CreateFieldStage
