import { useContext } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { OnSetRemarkActionContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import Tips from '@/Components/Tips'

const RemarkCheckBoxComponent = ({
  remarkId,
  setRemark,
  permits: { vault },
}) => {
  const onSetRemark = useContext(OnSetRemarkActionContext)

  return (
    <div className="ml-2">
      <Tips text={setRemark ? 'Исключить из свода' : 'Включить в свод'}>
        <CheckBox
          onInput={onSetRemark({
            remarkIds: [remarkId],
            vault: !setRemark,
          })}
          disabled={!vault}
          value={setRemark}
        />
      </Tips>
    </div>
  )
}

RemarkCheckBoxComponent.propTypes = {
  remarkId: PropTypes.string,
  setRemark: PropTypes.bool,
  permits: PropTypes.object,
}

export default RemarkCheckBoxComponent
