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
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
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

export const Actions = styled.div`
  margin-bottom: 24px;
`;

export const ChildSelectorContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: #fafafa;
`;

export const AttendanceSection = styled.div`
  margin-bottom: 24px;
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
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
`;

export const AttendanceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const AttendanceCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
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
  margin-right: 16px;
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

export const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  min-width: 120px;
`;

export const StatusBadge = styled.div<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'present':
        return '#E8F5E8';
      case 'checked_out':
        return '#FFF3E0';
      case 'absent':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'present':
        return '#2E7D32';
      case 'checked_out':
        return '#E65100';
      case 'absent':
        return '#C62828';
      default:
        return '#666';
    }
  }};
`;

export const TimeInfo = styled.div`
  font-size: 11px;
  color: #666;
  text-align: center;
`;

export const CardActions = styled.div`
  display: flex;
  align-items: center;
`;

export const MenuContainer = styled.div`
  position: relative;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

export const MenuDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  margin-bottom: 4px;
`;

export const MenuItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
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

export const DetailsModal = styled.div`
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

export const DetailsModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

export const DetailsModalHeader = styled.div`
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
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #333;
  }
`;

export const DetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const DetailLabel = styled.div`
  font-weight: 600;
  color: #333;
  min-width: 120px;
`;

export const DetailValue = styled.div`
  color: #666;
  text-align: right;
  flex: 1;
  margin-left: 16px;
`;

export const StickerPreviewModal = styled.div`
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

export const StickerPreviewContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

export const StickerPreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

export const StickerPreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
`;

export const StickerPreview = styled.div`
  width: 200px;
  height: 120px;
  padding: 8px;
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  border: 2px solid #000;
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
  margin-bottom: 6px;
`;

export const StickerName = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

export const StickerAge = styled.div`
  font-size: 10px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
`;

export const StickerContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StickerInfo = styled.div`
  font-size: 9px;
  margin-bottom: 3px;
`;

export const StickerWarning = styled.div`
  font-size: 9px;
  font-weight: bold;
  margin-bottom: 3px;
  border-left: 2px solid #000;
  padding-left: 4px;
`;

export const StickerFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #000;
  padding-top: 4px;
  margin-top: 6px;
`;

export const StickerAuth = styled.div`
  font-size: 8px;
`;

export const StickerIcon = styled.div`
  font-size: 12px;
`;

export const StickerPreviewActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  
  button {
    flex: 1;
    min-width: 120px;
  }
`; 