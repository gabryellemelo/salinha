import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, #FFE5F1 0%, #FFE4B5 25%, #E8F4FD 50%, #F0FFF0 75%, #F8E6FF 100%);
  
  @media (max-width: 768px) {
    padding: 8px;
    align-items: flex-start;
    min-height: auto;
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
  max-width: 1200px;
  
  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 12px;
    max-width: 100%;
    margin: 0;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    overflow-x: visible;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableHeader = styled.thead`
  background: rgba(168, 230, 207, 0.3);
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

export const TableCell = styled.td`
  padding: 16px 12px;
  font-size: 14px;
  color: #666;
`;

export const RoleBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

export const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// Mobile Card Layout
export const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

export const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const MobileCardName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
`;

export const MobileCardEmail = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const MobileCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

export const MobileCardActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    margin-top: 16px;
    padding-top: 16px;
  }
`;

// Modal Styles
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
    max-height: 85vh;
    width: 95%;
    max-width: 400px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const ModalBody = styled.div`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
  
  button {
    min-width: 120px;
    flex: 1;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  transition: border-color 0.2s ease;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  
  &:focus {
    outline: none;
    border-color: #FF69B4;
  }
  
  option {
    background: white;
    color: #333;
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const CustomSelectContainer = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  &.custom-select-container {
    position: relative;
  }
`;

export const CustomSelectButton = styled.button<{ isOpen?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.isOpen ? '#FF69B4' : '#e1e5e9'};
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #FF69B4;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
  }
`;

export const CustomDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: -2px;
`;

export const CustomOption = styled.div`
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &.selected {
    background-color: #FF69B4;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
  }
`; 