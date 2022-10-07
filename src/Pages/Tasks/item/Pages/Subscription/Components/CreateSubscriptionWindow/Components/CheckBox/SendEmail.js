import CheckBox from "../../../../../../../../../Components/Inputs/CheckBox"
import React, {useContext} from "react";
import {EmailContext} from "../../constans"

const SendSystem = ({ParentValue: {emplId, ...item} = {}}) => {
  const {value, onInput} = useContext(EmailContext)
  return <div className="flex items-center h-full justify-center w-full">
    <CheckBox
      checkBoxValue={emplId}
      key={emplId}
      value={value}
      onInput={onInput}
    />
  </div>
}

export default SendSystem

SendSystem.defaultProps = {
  emplId: ""
};