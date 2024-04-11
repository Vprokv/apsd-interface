import DocumentComponent from '@/Pages/Information/Components/RowComponents.js/DocumenComponent'
import FolderComponent from '@/Pages/Information/Components/RowComponents.js/FolderComponent'

const SelectorRowComponent = ({ contentId, ...props }) => {
  return contentId ? (
    <DocumentComponent {...props} contentId={contentId} />
  ) : (
    <FolderComponent {...props} />
  )
}

export default SelectorRowComponent
