import styled, { css } from 'styled-components'
import { Container } from '@Components/Components/Inputs/styles'
import ModalWindow from '../../ModalWindow'

export const FileInputContainer = styled(Container.withComponent('button'))`
  width: 100%;
  height: 100%;
  display: flex;
  font-size: 14px;
  transition: color 500ms ease-in-out;

  &:hover,
  &:active {
    color: var(--accent-color);
  }
`

export const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 1px;
  z-index: 10;
  background-color: var(--background-primary);
  border-radius: 50%;
  border: 1px solid var(--form-elements-border-color, #bdbdbd);
  padding: 4px;
  transition: all 500ms ease-in-out;

  &:hover {
    color: var(--accent-color);
    border-color: var(--accent-color);
  }
`

export const ReUploadFileButton = styled.button`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1px;
  top: 0;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
  background-color: var(--background-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
  color: var(--accent-color);
`

export const PreloaderContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1px;
  top: 0;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
  background-color: var(--background-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
`

export const OptionContainer = styled.div`
  border: 1px solid var(--form-elements-border-color, #bdbdbd);
  border-radius: 2px;
  padding: 2px 10px;
  position: relative;
  color: var(--text-primary);

  &:not(:hover) {
    ${PreloaderContainer} {
      opacity: 1;
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: -1px;
    bottom: -1px;
    width: calc(${({ progress }) => progress}% + 2px);
    height: 2px;
    background-color: var(--accent-color);
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    transition: background-color 500ms ease-in-out;
  }

  &::before {
    content: '';
    position: absolute;
    left: -1px;
    bottom: -1px;
    width: calc(100% + 2px);
    height: 2px;
    background-color: var(--form-elements-border-color, #bdbdbd);
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
    transition: background-color 500ms ease-in-out;
  }

  ${({ fail }) =>
    fail &&
    css`
      border-color: var(--error-color, #f44336);

      &::after {
        background-color: var(--error-color, #f44336);
      }

      &:not(:hover) {
        color: var(--error-color, #f44336);

        &::before {
          background-color: var(--error-color, #f44336);
        }
      }

      &:hover {
        ${ReUploadFileButton} {
          opacity: 1;
        }
      }
    `};
`

export const RejectedFilesModalWindow = styled(ModalWindow)`
  background-color: var(--background-primary);
  width: 40%;
`

export const ModalSubmitButton = styled.button`
  background-color: var(--accent-color);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
`
