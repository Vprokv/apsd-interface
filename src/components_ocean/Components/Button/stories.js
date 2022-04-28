import React from "react"
import BsButton from "./index"

export default {
  title: "Components/Buttons/Button",
  component: BsButton,
  argTypes: {
    loading: {
      description: "Индикатор загрузки при клик на кнопку",
    },
    classNameChildren: {
      description: "deprecated",
    },
    children: {
      description: "HTML свойство класс",
    },
    style: {
      description: "HTML свойство стиль",
    },
    disabled: {
      description: "HTML блокировка",
    },
    onClick: {
      description: "HTML свойство обработчик события",
    },
    onMouseDown: {
      description: "HTML свойство обработчик события",
    },
    onMouseUp: {
      description: "HTML свойство обработчик события",
    },
    type: {
      description: "HTML свойство тип кнопки button submit...",
    },
    name: {
      description: "HTML свойство имя",
    },
  }
}

const Template = (args) => (
  <div className="display-flex fd-column j-c-start">
    <div className="p-b-10"><BsButton {...args} /></div>
    <div className="p-b-10"><BsButton {...args} disabled>disabled</BsButton></div>
    <div className="p-b-10"><BsButton {...args} disabled loading>loading</BsButton></div>
  </div>
)

export const Default = Template.bind({})
Default.args = { children: "black-btn", className: "btn black-btn width-medium" }

export const Colors = () => (
  <div className="display-flex fd-column j-c-start">
    <div><BsButton className="btn width-min m-b-10 black-btn">black-btn</BsButton></div>
    <div><BsButton className="btn width-midi m-b-10 golden">golden</BsButton></div>
    <div><BsButton className="btn width-medium m-b-10 light-grey">light-grey</BsButton></div>
    <div><BsButton className="btn width-max m-b-10 grey-bg">grey-bg</BsButton></div>
  </div>
)
export const Sizes = () => (
  <div className="display-flex fd-column j-c-start">
    <div><BsButton className="btn black-btn m-b-10">no width</BsButton></div>
    <div><BsButton className="btn black-btn width-min m-b-10">width-min</BsButton></div>
    <div><BsButton className="btn black-btn width-midi m-b-10">width-midi</BsButton></div>
    <div><BsButton className="btn black-btn width-medium m-b-10">width-medium</BsButton></div>
    <div><BsButton className="btn black-btn width-max m-b-10">width-max</BsButton></div>
  </div>
)
