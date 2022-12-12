import styled from "styled-components";

export const CustomButtonForIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  //background: var(--light-gray);
  width: 32px;
  height: 32px;
  //border: 1px solid var(--separator);
  box-sizing: border-box;
  border-radius: 6px;

  &:disabled {
    //background: var(--separator);
    color: var(--text-secondary);
  }
`