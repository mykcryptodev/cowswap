import styled from 'styled-components/macro'

import { UI } from 'common/constants/theme'

export const MenuBadge = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 5px;
  margin: 0 0 0 5px;
  background: var(${UI.COLOR_ALERT2_BG});
  color: var(${UI.COLOR_ALERT2_TEXT});
  border: 0;
  cursor: pointer;
  border-radius: 16px;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  font-weight: 600;
  transition: color 0.15s ease-in-out;
`
