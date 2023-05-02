import styled from 'styled-components'

export const Line = styled.span`
  height: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${({ barWidth }) => `${barWidth}%`};
`

export const NotificationItem = styled.div`
  position: relative;
  overflow: hidden;
  width: 390px;
  height: 85px;
  padding: 24px 22px 28px 16px;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  font-size: 14px;
  //right: 16px;
  &.info {
    background: rgba(212, 247, 255);

    ${Line} {
      background-color: var(--light-blue);
    }
  }

  &.success {
    background-color: #d2f7c5;

    ${Line} {
      background-color: var(--green);
    }
  }

  &.error {
    background: #ffe3e4;

    ${Line} {
      background: var(--red);
    }
  }
`

export const NotificationActions = styled.div`
  float: right;
  width: 44px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
`
export const NotificationContainer = styled.div`
  z-index: 1001;
  position: fixed;
  top: 88px;
  right: 16px;
`
