import DocumentComponent from '@/Pages/Reference/Components/RowComponents.js/DocumenComponent'
import FolderComponent from '@/Pages/Reference/Components/RowComponents.js/FolderComponent'

const SelectorRowComponent = ({ mimeType, ...props }) => {
  return mimeType ? (
    <DocumentComponent {...props} />
  ) : (
    <FolderComponent {...props} />
  )
}

export default SelectorRowComponent
