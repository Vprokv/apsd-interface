import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { CircleMinus } from "@/Pages/Settings/Roles/Icon/CircleMinus"
import { CirclePlus } from "@/Pages/Settings/Roles/Icon/CirclePlus"
import { Dot } from "@/Pages/Settings/Roles/Icon/Dot"
import Icon from "@/Components/Icon"

const PlusIcon = Icon(CirclePlus)
const MinusIcon = Icon(CircleMinus)
const DotICon = Icon(Dot)

const Tree = ({ subTable, formPayload, nestedDataKey, renderNestedBranch, value, renderIcon, onToggleRenderNestedTable, status }) => {
  const haveNestedData = useMemo(() => {
    const { [nestedDataKey]: CHILDRENS } = formPayload
    return CHILDRENS && Array.isArray(CHILDRENS) ? CHILDRENS.length > 0 : CHILDRENS
  }, [nestedDataKey, formPayload])

  const ComponentIcon = haveNestedData ? renderNestedBranch ? MinusIcon : PlusIcon : DotICon

  return (
    <div className="display-flex a-i-center">
      <div className={`${subTable === 0 ? "fw700" : ""} display-flex a-i-center word-wrap-anywhere`}>
        {renderIcon && (
          <ComponentIcon
            className={`${!status ? "color-greyDarken" : "transition-black-gold"} m-r-10`}
            size={haveNestedData ? 12 : 4}
            onClick={onToggleRenderNestedTable}
          />
        )}
        {value}
      </div>
    </div>
  )
}

Tree.propTypes = {
  onToggleRenderNestedTable: PropTypes.func,
  value: PropTypes.string,
  subTable: PropTypes.number,
  formPayload: PropTypes.object,
  nestedDataKey: PropTypes.string,
  renderNestedBranch: PropTypes.bool,
  renderIcon: PropTypes.bool,
  status: PropTypes.bool,
}

Tree.defaultProps = {
  nestedDataKey: "CHILDRENS",
  status: true,
  formPayload: {},
  renderIcon: true
}

export default Tree
