import React, { Component } from "react"
import styled from "styled-components";
import PropTypes from "prop-types"
import memoizeOne from "memoize-one"
import AccumulateFunctionCall from "../../../Utils/FunctionCall/AccumulateFunctionCall";
import Cell from "./Cell"
import {CellContainer, GridContainer} from "./styles"
// eslint-disable-next-line import/no-cycle
import ListTable from "./index"
//
// const NestedTable = styled(ListTable)`
//   grid-column: 1 / -1;
// `

// eslint-disable-next-line react/prop-types
const DefaultRowComponent = ({ id, className, children, style }) => <GridContainer id={id} className={className} style={style}>{children}</GridContainer>

class Row extends Component {
  constructor(props) {
    super(props)
    this.state = { renderNestedBranch: false }
  }

  getRowPadding = memoizeOne((subTable) => ({ paddingLeft: `calc(${subTable * 15}px + var(--layout-left-padding))` }))

  onInput = AccumulateFunctionCall(((...updates) => {
    const { onInput } = this.props
    onInput(this.mergeValues(updates))
  }))


  onDelete = () => {
    const { onDelete, rowIndex } = this.props
    onDelete(rowIndex)
  }

  onNestedTableInput = (value) => {
    const { settings: { nestedDataKey } } = this.props
    this.onInput(value, nestedDataKey)
  }

  getValue = (acc = []) => {
    const { props: { value, subTable, getParentValue } } = this
    acc.unshift(value)
    return subTable ? getParentValue(acc) : acc
  }

  onToggleRenderNestedTable = () => {
    this.setState(({ renderNestedBranch }) => ({ renderNestedBranch: !renderNestedBranch }))
  }

  mergeValues = (updates) => {
    const { value, rowIndex } = this.props
    return {
      newData: updates.reduce((acc, [value, id]) => {
        if (value === undefined) {
          delete acc[id]
        } else {
          acc[id] = value
        }
        return acc
      },
      { ...value }),
      rowIndex,
      data: [...updates]
    }
  }

  onRowInput = (newData, rowIndex) => {
    const { onInput } = this.props
    onInput({
      newData,
      rowIndex,
      data: newData
    })
  }

  renderTableColumnConfig = memoizeOne(({ nestedTableColumnConfig, ...providedSettings }, subTable) => {
    if (nestedTableColumnConfig) {
      return {
        ...providedSettings,
        columns: nestedTableColumnConfig[subTable + 1] || providedSettings.columns,
        nestedTableColumnConfig
      }
    }
    return providedSettings
  })

  render() {
    const {
      props: {
        value, rowIndex, settings, subTable, collapsedColumnState, collapsedGroup, onCollapseColumn, style,
        columnState: { styles, columns },
        settings: { nestedDataKey, rowComponent: RowComponent = DefaultRowComponent }
      },
      state: { renderNestedBranch }
    } = this
    const rowPadding = this.getRowPadding(subTable)
    return (
      <RowComponent
        value={value}
        subTable={subTable}
        onInput={this.onRowInput}
        id={rowIndex}
        elementPadding={rowPadding}
        nestedDataKey={nestedDataKey}
        className="grid py-2"
        style={style}
      >
        {
          columns.map(({
            component: CellComponent = Cell, style, id, label, collapsibleGroup, props, className = "", keepNestingPadding,
            collapseAble, keepArrowIndent
          }, index) => (
            <CellContainer
              key={label}
              className={`${className} flex items-baseline`}
              style={style}
            >
              <CellComponent
                {...props}
                id={id}
                value={value[id]}
                rowIndex={rowIndex}
                renderNestedBranch={renderNestedBranch}
                expanded={collapsedColumnState[id]}
                ParentValue={value}
                nestedDataKey={nestedDataKey}
                subTable={subTable}
                getParentValue={this.getValue}
                onInput={this.onInput}
                onDelete={this.onDelete}
                onToggleRenderNestedTable={this.onToggleRenderNestedTable}
              />
            </CellContainer>
          ))
        }
        {renderNestedBranch && (
          <ListTable
            settings={this.renderTableColumnConfig(settings, subTable)}
            parentCollapsedColumnState={collapsedColumnState}
            value={value[nestedDataKey]}
            subTable={subTable + 1}
            getParentValue={this.getValue}
            onInput={this.onNestedTableInput}
          />
        )}
      </RowComponent>
    )
  }
}

Row.propTypes = {
  onInput: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  collapsedColumnState: PropTypes.object,
  settings: PropTypes.object,
  value: PropTypes.object,
  getParentValue: PropTypes.func,
  subTable: PropTypes.number,
  keepNestingPadding: PropTypes.bool,
  loading: PropTypes.bool,
  collapsedGroup: PropTypes.array
}
Row.defaultProps = {
  value: {},
  settings: {},
  collapsedColumnState: {},
  subTable: 0
}

export default Row
