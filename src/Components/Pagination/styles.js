import styled, {css} from "styled-components";

export const PaginationButton = styled.button`
  color: var(--text-secondary);
  border-radius: 6px;
  ${(({ active }) => active && css`
    color: var(--blue-1);
    background: #d2dff9;
  `)};
  width: 20px;
  height: 20px;
  font-size: 12px;
`
