import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { OnSetRemarkActionContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'

const IterationRemarksCheckBoxComponent = ({ remarks }) => {
  const onSetRemark = useContext(OnSetRemarkActionContext)
  const disabled = useMemo(() => {
    let val = true
    if (remarks.length) {
      val = !remarks[0]?.permits?.vault
    }
    return val
  }, [remarks])

  const vault = useMemo(
    () => remarks?.some(({ setRemark }) => setRemark === false),
    [remarks],
  )

  return (
    <div className="ml-2">
      <CheckBox
        value={!vault}
        onInput={onSetRemark({
          remarkIds: remarks?.map(({ remarkId }) => remarkId),
          vault,
        })}
        disabled={disabled}
      />
    </div>
  )
}

IterationRemarksCheckBoxComponent.propTypes = {
  remarks: PropTypes.array,
}

export default IterationRemarksCheckBoxComponent
