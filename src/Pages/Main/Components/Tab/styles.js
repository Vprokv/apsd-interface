import styled, { css } from 'styled-components'
import Icon from '@Components/Components/Icon'

export const Container = styled.button`
  max-width: 150px;
  user-select: none;
  padding-top: 5px;
  padding-bottom: 5px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  ${({ active }) =>
    active
      ? css`
          background-color: #d2dff9;
          color: var(--blue-1);
        `
      : css`
          background-color: var(--light-gray);
          color: var(--text-secondary);
        `};
`

export const CloseIcon = styled(Icon)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${({ active }) =>
    active ? 'var(--blue-1)' : 'var(--secondary)'};
  padding: 3px 3px 3px;
  transition: background-color 250ms ease-in-out;
  &:hover {
    background: var(--blue-1);
  }
`
