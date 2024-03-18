import { useContext } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { OnSetRemarkActionContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'

const RemarkCheckBoxComponent = ({
  remarkId,
  setRemark,
  permits: { vault },
}) => {
  const onSetRemark = useContext(OnSetRemarkActionContext)

  return (
    <div className="ml-2">
      <CheckBox
        onInput={onSetRemark({
          remarkIds: [remarkId],
          vault: !setRemark,
        })}
        disabled={!vault}
        value={setRemark}
      />
    </div>
  )
}

RemarkCheckBoxComponent.propTypes = {
  remarkId: PropTypes.string,
  setRemark: PropTypes.bool,
  permits: PropTypes.object,
}

export default RemarkCheckBoxComponent
