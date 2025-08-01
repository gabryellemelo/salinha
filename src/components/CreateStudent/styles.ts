import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, #FFE5F1 0%, #FFE4B5 25%, #E8F4FD 50%, #F0FFF0 75%, #F8E6FF 100%);
  
  @media (max-width: 768px) {
    padding: 12px;
    align-items: center;
  }
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 500px;
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    max-width: 100%;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const AuthorizationSection = styled.div`
  margin-top: 8px;
`;

export const RadioContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const RadioButton = styled.div<{ selected: boolean; isNo?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 2px solid ${props => {
    if (props.selected) {
      return props.isNo ? '#f44336' : '#4CAF50';
    }
    return '#e1e5e9';
  }};
  border-radius: 12px;
  background-color: ${props => {
    if (props.selected) {
      return props.isNo ? '#f44336' : '#4CAF50';
    }
    return 'white';
  }};
  color: ${props => props.selected ? 'white' : '#333'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    border-color: ${props => props.isNo ? '#f44336' : '#4CAF50'};
    background-color: ${props => {
      if (props.selected) {
        return props.isNo ? '#f44336' : '#4CAF50';
      }
      return props.isNo ? '#ffebee' : '#f0f8f0';
    }};
  }

  span {
    font-weight: 600;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
