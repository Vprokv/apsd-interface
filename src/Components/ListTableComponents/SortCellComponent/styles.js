import styled from 'styled-components'

export const SortButton = styled.button`
  user-select: none;
  transition: color 250ms ease-in-out;
  color: ${({ current }) =>
    current ? 'var(--blue-1)' : 'var(--text-secondary)'};

  &:hover {
    color: var(--base);
  }
`
