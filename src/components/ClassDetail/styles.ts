import styled from "styled-components";

export const Container = styled.div`
  background: linear-gradient(135deg, #FFE5F1 0%, #FFE4B5 25%, #E8F4FD 50%, #F0FFF0 75%, #F8E6FF 100%);
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
`;

export const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

export const ModernIcon = styled.div`
  font-size: 80px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Form = styled.form`
  width: 100%;
`;

export const ScheduleCard = styled.div`
  background-color: #F9F9F9;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: left;
  border: 1px solid #ddd;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;
