import styled from 'styled-components';

export const FloatingLanguageSelector = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }
`;
