import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import Input from '@/Components/Fields/Input'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'
import ScrollBar from 'react-perfect-scrollbar'
import { SecondaryOverBlueButton } from '@/Components/Button'

export const OrgStructureWindowComponent = styled(ModalWindow)`
  width: 41.25%;
  min-height: 30.21%;
  margin: auto;
`

const ShowTemplate = ({
  open,
  onClose,
  showTemplate: { dss_name, dss_json },
}) => {
  const renderTemplate = useMemo(
    () =>
      dss_json &&
      JSON.parse(dss_json)
        .map(AddUserOptionsFullName)
        .map(({ fullDescription, emplId }) => (
          <Input key={emplId} className="mt-4" value={fullDescription} />
        )),
    [dss_json],
  )

  return (
    <OrgStructureWindowComponent
      onClose={onClose}
      open={open}
      title={dss_name}
      index={1001}
    >
      <ScrollBar>
        <div className="m-4">{renderTemplate}</div>
      </ScrollBar>
      <div className="flex items-center justify-end mt-auto mt-auto">
        <SecondaryOverBlueButton onClick={onClose}>
          Закрыть
        </SecondaryOverBlueButton>
      </div>
    </OrgStructureWindowComponent>
  )
}

ShowTemplate.propTypes = {}

export default ShowTemplate
