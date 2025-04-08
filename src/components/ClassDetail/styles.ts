import styled from "styled-components";

export const Container = styled.div`
  background-color: #F8D7DD
  ;
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
  background-color: #fff;
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Icon = styled.img`
  width: 100px;
  height: 100px;
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
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;
