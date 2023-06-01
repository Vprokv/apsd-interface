import CheckBox, {
  Box,
  BoxContainer,
} from '@Components/Components/Inputs/CheckBox'
import styled from 'styled-components'

export default styled(CheckBox)`
  &:disabled {
    ${Box} {
      background-color: var(--input-placeholder-color, #bdbdbd) !important;
    }
  }

  ${BoxContainer} {
    background: var(--separator);
    border-radius: 4px;
    border: unset;
  }

  ${Box} {
    background: var(--blue-1);
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    border-radius: 4px;

    &::after {
      content: url('data:image/svg+xml; utf8, <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.82536 0.234914C9.06382 -0.0456238 9.48455 -0.0797367 9.76509 0.15872C10.0456 0.397177 10.0797 0.817905 9.84128 1.09844L4.17462 7.76509C3.93242 8.05003 3.50327 8.08005 3.22376 7.8316L0.223763 5.16494C-0.051424 4.92033 -0.0762119 4.49895 0.1684 4.22376C0.413012 3.94857 0.834393 3.92378 1.10958 4.16839L3.60014 6.38223L8.82536 0.234914Z" fill="white"/></svg>');
      position: absolute;
      top: -1.5px;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
`
