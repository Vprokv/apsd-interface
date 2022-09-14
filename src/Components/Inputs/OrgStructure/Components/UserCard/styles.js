import styled from "styled-components";

export const UserCircle = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${(({ bg }) => bg)};
  border-radius: 50%;
  flex: 0 0 auto;
`