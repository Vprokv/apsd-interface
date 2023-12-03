import UploadDoc from '@/Pages/Tasks/item/Icons/UploadDoc.svg'
import CreatingAdditionalAgreementWindowWrapper from '@/Pages/Tasks/item/Components/CreatingAdditionalAgreementWindow'

export default {
  key: 'additional_agreement',
  icon: UploadDoc,
  caption: 'Создание доп. согласования',
  handler: ({ openComponent }) =>
    openComponent({ Component: CreatingAdditionalAgreementWindowWrapper }),
}
