import styled, { css } from "styled-components";
import Icon from '@Components/Components/Icon'

export const Container = styled.div`
  ${(({ active}) => active
    ? css`
        background-color: #d2dff9;
        color: var(--blue-1);
      `
    : css`
        background-color: var(--light-gray);
        color: var(--text-secondary);
    `
  )};
`

export const CloseIcon = styled(Icon)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--secondary);
  padding: 3px 3px 3px;
  transition: background-color 250ms ease-in-out;
  &:hover {
    background: var(--blue-1);
  }
`