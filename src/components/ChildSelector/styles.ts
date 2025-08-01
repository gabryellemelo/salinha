import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  text-align: center;
`;

export const SearchContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SelectAllButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 182, 193, 0.5);
  color: #FF69B4;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: rgba(255, 182, 193, 0.1);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

export const ChildrenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 400px;
  overflow-y: auto;
`;

export const ChildCard = styled.div<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${props => props.selected ? 'rgba(255, 182, 193, 0.5)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 16px;
  background: ${props => props.selected ? 'rgba(255, 182, 193, 0.2)' : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(5px);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 20px;
    right: 20px;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
  }

  &:hover {
    border-color: rgba(255, 182, 193, 0.5);
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ChildInfo = styled.div`
  flex: 1;
`;

export const ChildName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

export const ChildDetails = styled.p`
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #666;
`;

export const ChildWarning = styled.p`
  margin: 0;
  font-size: 12px;
  color: #E65100;
  font-weight: 500;
`;

export const ChildStatus = styled.div`
  font-size: 18px;
  margin-left: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.children === '✓' ? 'rgba(255, 182, 193, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.children === '✓' ? '#FF69B4' : '#666'};
  font-weight: bold;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`; 