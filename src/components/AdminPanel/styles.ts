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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    max-width: 100%;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: #A8E6CF;
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

export const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

export const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

export const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.9);
  }
`;

export const ActionIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

export const ActionTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #333;
`;

export const ActionDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
`; 