import React from 'react'
import PropTypes from 'prop-types'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import Icon from '@Components/Components/Icon'
import AnswerIcon from '@/Icons/AnswerIcon'

const Number = ({ number }) => <BaseCell value={number} />

const ItsAnswer = () => (
  <Icon className="h-10 w-5  color-blue-1" size={30} icon={AnswerIcon} />
)

const NumberComponent = ({
  ParentValue: {
    itsRemark,
    props: { number },
  },
}) => (itsRemark ? <Number number={number} /> : <ItsAnswer />)

NumberComponent.propTypes = {
  ParentValue: PropTypes.object,
}

export default NumberComponent
