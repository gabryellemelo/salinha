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
  max-width: 1200px;
  
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

export const FilterToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    background: white;
    transition: all 0.2s ease;
    
    &:checked {
      background: #FF69B4;
      border-color: #FF69B4;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    &:hover {
      border-color: #FF69B4;
      box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
    }
    
    &:focus {
      outline: none;
      border-color: #FF69B4;
      box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.3);
    }
  }
  
  label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      color: #FF69B4;
    }
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
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;



export const SchedulesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ScheduleCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const ScheduleHeader = styled.div`
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ScheduleTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  flex: 1;
  margin-right: 12px;
`;

export const ScheduleSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 16px 0;
`;

export const ScheduleDateTime = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const ScheduleUsers = styled.div`
  margin-bottom: 16px;
`;

export const ScheduleLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

export const UsersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const UserTag = styled.span`
  background: #A8E6CF;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const ScheduleActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px;
  color: #9ca3af;
  transition: color 0.2s ease;
  
  &:hover {
    color: #374151;
  }
`;

export const MenuDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 2px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  min-width: 120px;
  z-index: 1000;
  overflow: hidden;
`;

export const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  
  &:hover {
    background: #f9fafb;
  }
`;

export const ActionButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #475569;
  width: 100%;
  
  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
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
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
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
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
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

export const CheckboxContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px;
  background: white;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #ddd;
    border-radius: 4px;
    margin-right: 12px;
    cursor: pointer;
    position: relative;
    background: white;
    transition: all 0.2s ease;
    
    &:checked {
      background: #FF69B4;
      border-color: #FF69B4;
      
      &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
    }
    
    &:hover {
      border-color: #FF69B4;
      box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.2);
    }
    
    &:focus {
      outline: none;
      border-color: #FF69B4;
      box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.3);
    }
  }
  
  label {
    cursor: pointer;
    font-size: 14px;
    color: #333;
    margin: 0;
    font-weight: 500;
    flex: 1;
    
    &:hover {
      color: #FF69B4;
    }
  }
`; 