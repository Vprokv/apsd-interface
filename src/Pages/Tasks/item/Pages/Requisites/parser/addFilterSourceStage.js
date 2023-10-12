import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

const addFilterSourceStage =
  () =>
  (fieldState) =>
  ({ attr: { dss_attr_name } }) => {
    fieldState.hooks.push(({ filter }) => {
      const { type: documentType } = useParams()
      return {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        filter: useMemo(
          () => ({
            ...filter,
            source: `${documentType}.${dss_attr_name}`,
          }),
          [documentType, filter],
        ),
      }
    })
  }

export default addFilterSourceStage
