import PropTypes from "prop-types"
import { useCallback, useEffect, useRef } from "react"
// import useOpenContextMenu from "@/Core/Hooks/useOpenContextMenu"
// import { ContextMenuForm } from "@/Components/Forms/StateFullForm"
// import WithSubmitContainerHoc from "@/Core/Decorators/WithSubmitContainerHOC"
// import RefCheckboxGroup from "@/Components/Fields/RefCheckboxGroup"
// import { newApiService } from "@/api"
// import { contextMenuSettings } from "./filterHook"

const ApiFilter = ({ onFilter, filterQuery, children }) => {
  // const refFilterState = useRef(filterQuery)
  // useEffect(() => {
  //   refFilterState.current = filterQuery
  // }, [filterQuery])
  // const [onFilterRows] = useOpenContextMenu({
  //   settings: contextMenuSettings,
  //   onOpenContextMenu: useCallback(({ applyContextMenu }, { id, data = id, filter: { api, props = {} } = {}, label }) => {
  //     const {
  //       v_filter: { [data]: currentFilter = [], ...columnFilters } = {},
  //       ...filterState
  //     } = refFilterState.current
  //     return applyContextMenu([
  //       {
  //         component: ContextMenuForm,
  //         onSubmit: ({ FILTER }) => {
  //           onFilter({
  //             ...filterState,
  //             v_filter: FILTER.length === 0 ? columnFilters : { ...columnFilters, [data]: FILTER }
  //           })
  //         },
  //         componentProps: {
  //           initPayload: {
  //             FILTER: currentFilter
  //           },
  //           btnText: "Apply",
  //           fields: [
  //             {
  //               id: "FILTER",
  //               label: "Filter by:",
  //               blockTitle: label,
  //               component: WithSubmitContainerHoc(RefCheckboxGroup),
  //               refLoader: (params) => newApiService.get(api, { params }),
  //               ...props,
  //               preload: true,
  //               reverseMode: true,
  //               maxHeight: "350px"
  //             }
  //           ]
  //         }
  //       }
  //     ])
  //   }, [onFilter])
  // })
  return children({
    // filterQuery: filterQuery.v_filter,
    // onFilterRows
  })
}

ApiFilter.propTypes = {
  filterQuery: PropTypes.object,
  onFilter: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
}

ApiFilter.defaultProps = {
  filterQuery: {}
}

export default ApiFilter
