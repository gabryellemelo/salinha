import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(
    135deg,
    #ffe5f1 0%,
    #ffe4b5 25%,
    #e8f4fd 50%,
    #f0fff0 75%,
    #f8e6ff 100%
  );

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
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    max-width: 90%;
  }
`;

export const Header = styled.div`
  text-align: left;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: #a8e6cf;
  color: white;
  padding: 12px;
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

export const FiltersContainer = styled.div`
  margin-bottom: 24px;
`;

export const SearchContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
`;

export const StatusFilters = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${(props) => (props.active ? "#4A90E2" : "#E0E0E0")};
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#4A90E2" : "#FFFFFF")};
  color: ${(props) => (props.active ? "#FFFFFF" : "#333")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4a90e2;
    background-color: ${(props) => (props.active ? "#4A90E2" : "#F0F8FF")};
  }
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
  max-height: 600px;
  overflow-y: auto;
`;

export const AttendanceCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  margin-bottom: 8px;
  position: relative;

  &:not(:last-child)::after {
    content: "";
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
  margin-right: 20px;
`;

export const ChildName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const ChildDetails = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
`;

export const ChildWarning = styled.p`
  margin: 0;
  font-size: 12px;
  color: #e65100;
  font-weight: 500;
`;

export const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 120px;
`;

export const StatusBadge = styled.div<{ status: string }>`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  display: inline-block;
  background-color: ${(props) => {
    switch (props.status) {
      case "present":
        return "#E8F5E8";
      case "checked_out":
        return "#FFF3E0";
      case "absent":
        return "#FFEBEE";
      default:
        return "#F5F5F5";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case "present":
        return "#2E7D32";
      case "checked_out":
        return "#E65100";
      case "absent":
        return "#C62828";
      default:
        return "#666";
    }
  }};
`;

export const TimeInfo = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  div {
    margin-bottom: 4px;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
`;
