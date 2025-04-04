import styled from "styled-components";

export const Container = styled.div`
  background-color: #DFFFE0;
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', sans-serif;
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

export const ContainerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChildCard = styled.div`
  background-color: #F9F9F9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChildName = styled.strong`
  font-size: 16px;
  color: #333;
`;

export const ChildInfo = styled.span`
  font-size: 14px;
  color: #555;
`;

export const ReleasedBy = styled.span`
  color: green;
  font-weight: bold;
  margin-top: 8px;
`;

export const ContainerButton = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const WhatsAppButton = styled.a`
  flex: 1;
  background-color: #6BBF59;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;
