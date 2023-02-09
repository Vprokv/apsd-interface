import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import uploadIcon from '@Components/Icons/uploadIcon'
import { preloader } from '@Components/Icons/preloader'
import Close from '@Components/Icons/close'

import {
  OptionContainer,
  PreloaderContainer,
  RemoveButton,
  ReUploadFileButton,
} from './style'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'
import CardFileIcon from '@/Icons/CardFileIcon'
import closeIcon from '@/Icons/closeIcon'

const UploadingOption = ({
  value: { dss_content_name = '', progress, fail },
  onReUpload,
  onDelete,
}) => {
  const [name = '', format = ''] = dss_content_name.split('.')

  return (
    <OptionContainer progress={progress} fail={fail}>
      <div className="flex items-center">
        <Icon
          className="mb-2 color-light-gray mr-2"
          size={22}
          icon={CardFileIcon}
        />
        <BaseSubCell value={name} subValue={format} />
      </div>
      {progress && !fail && (
        <PreloaderContainer>
          <Icon icon={preloader} size={18} />
        </PreloaderContainer>
      )}
      {fail && (
        <ReUploadFileButton
          title="retry upload"
          type="button"
          onClick={onReUpload}
        >
          <Icon icon={uploadIcon} />
        </ReUploadFileButton>
      )}
      <RemoveButton type="button" onClick={onDelete}>
        <Icon icon={closeIcon} size={6} />
      </RemoveButton>
    </OptionContainer>
  )
}

UploadingOption.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    fail: PropTypes.bool,
  }).isRequired,
  onReUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

const UploadedOption = ({ value, onDelete }) => (
  <OptionContainer>
    {value}
    <RemoveButton type="button" onClick={onDelete}>
      <Icon icon={Close} size={6} />
    </RemoveButton>
  </OptionContainer>
)

UploadedOption.propTypes = {
  value: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
}

const Option = ({ value, ...props }) => {
  return typeof value === 'string' ? (
    <UploadedOption value={value} {...props} />
  ) : (
    <UploadingOption value={value} {...props} />
  )
}

Option.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
}

export default Option
