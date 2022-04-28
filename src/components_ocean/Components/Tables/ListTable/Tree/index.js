import React, { Component } from "react"
import PropTypes from "prop-types"
import Icon from "@/Components/Icon"
import { CircleMinus } from "./icons/CircleMinus"
import { CirclePlus } from "./icons/CirclePlus"
import { Dot } from "./icons/Dot"

const PlusIcon = Icon(CirclePlus)
const MinusIcon = Icon(CircleMinus)
export const DotIcon = Icon(Dot)

class Tree extends Component {
  render() {
    const { value, subTable, childernKey, formPayload, onToggleRenderNestedTable, renderNestedBranch } = this.props
    const { [childernKey]: CHILDRENS } = formPayload
    const haveNestedData = CHILDRENS && Array.isArray(CHILDRENS) ? CHILDRENS.length > 0 : CHILDRENS
    const OpenIcon = haveNestedData ? renderNestedBranch ? MinusIcon : PlusIcon : DotIcon
    // const toggleNestedRender = () => {}
    return (
      <div className="display-flex a-i-center">
        <div className="m-r-10 transition-black-gold">
          <div className="display-flex j-c-center min-width-12">
            <OpenIcon
              size={haveNestedData ? "12" : "4"}
              onClick={onToggleRenderNestedTable}
            />
          </div>
        </div>
      </div>
    )
  }
}

Tree.propTypes = {}

export default Tree
