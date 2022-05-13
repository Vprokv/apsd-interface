import { useCallback, useEffect, useMemo, useRef } from "react"
// import useOpenContextMenu from "@/Core/Hooks/useOpenContextMenu"
// import { ContextMenuForm } from "@/Components/Forms/StateFullForm"
// import WithSubmitContainerHoc from "@/Core/Decorators/WithSubmitContainerHOC"
// import CheckboxGroup from "@/Components/Fields/CheckboxGroup"

export const contextMenuSettings = { minSize: "200" }

function compareFilterWithValueFunc(v, filterVal) {
  return v === null ? filterVal === undefined : (typeof v === "object" ? v.ID : v) === filterVal
}

// TODO реализовать полнотекстовый поиск
export const useFilter = (value, filterState) => useMemo(() => {
  const unWrappedFilterState = Object.entries(filterState)
  if (unWrappedFilterState.length > 0) {
    const { renderValue, indexesMap } = value.reduce((acc, value, index) => {
      if (unWrappedFilterState
        .every(([filterKey, filterValue]) => Array.isArray(filterValue)
          ? filterValue.every((filterValueItem) => !compareFilterWithValueFunc(value[filterKey], filterValueItem))
          : !compareFilterWithValueFunc(value[filterKey], filterValue))
      ) {
        acc.renderValue.push(value)
        acc.indexesMap.push(index)
      }
      return acc
    }, { renderValue: [], indexesMap: [] })
    return { renderValue, getRowPhysicalIndex: (index) => indexesMap[index] }
  }
  return { renderValue: value, getRowPhysicalIndex: (index) => index }
}, [filterState, value])

export const useOpenInnerFilterMenu = (value, filterState, setFilterState) => {
  // const refFilterState = useRef(filterState)
  //
  // useEffect(() => {
  //   refFilterState.current = filterState
  // }, [filterState])
  //
  // const [onFilterRows] = useOpenContextMenu({
  //   settings: contextMenuSettings,
  //   onOpenContextMenu: useCallback(({ applyContextMenu }, { id, data = id, label }) => {
  //     const { [data]: currentFilter = [], ...columnFilters } = refFilterState.current
  //
  //     const { options } = value.reduce((acc, { [data]: v = "blank" }) => {
  //       if (typeof v === "object") {
  //         if (v !== null) {
  //           if (!acc.set.includes(v.ID)) {
  //             acc.options.push(v)
  //             acc.set.push(v.ID)
  //           }
  //         } else if (!acc.set.includes("blank")) {
  //           acc.options.push({ ID: "blank", SYS_NAME: "blank" })
  //           acc.set.push("blank")
  //         }
  //       } else if (!acc.set.includes(v)) {
  //         acc.options.push({ ID: v, SYS_NAME: v })
  //         acc.set.push(v)
  //       }
  //       return acc
  //     }, { options: [], set: [] })
  //     return applyContextMenu([
  //       {
  //         component: ContextMenuForm,
  //         onSubmit: ({ FILTER }) => {
  //           setFilterState(options.length === FILTER.length
  //             ? columnFilters
  //             : {
  //               ...columnFilters,
  //               [data]: options.reduce((acc, { ID }) => {
  //                 if (!FILTER.includes(ID)) {
  //                   acc.push(ID === "blank" ? undefined : ID)
  //                 }
  //                 return acc
  //               }, []) })
  //         },
  //         componentProps: {
  //           initPayload: {
  //             FILTER: options.reduce((acc, { ID }) => {
  //               if (!currentFilter.includes(ID === "blank" ? undefined : ID)) {
  //                 acc.push(ID)
  //               }
  //               return acc
  //             }, [])
  //           },
  //           btnText: "Apply",
  //           fields: [
  //             {
  //               id: "FILTER",
  //               label: "Filter by:",
  //               blockTitle: label,
  //               style: { "--separator-color": "var(--color-grey-darken-0)", "--padding-search-in-filter": "0 0 10px 0" },
  //               inputStyles: { "--width-input": "110px" },
  //               component: WithSubmitContainerHoc(CheckboxGroup),
  //               showToggleIndicator: false,
  //               maxHeight: "200px",
  //               options
  //             }
  //           ]
  //         }
  //       }
  //     ])
  //   }, [setFilterState, value])
  // })
  // return onFilterRows
}
