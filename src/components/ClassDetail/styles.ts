import styled from "styled-components";

export const Container = styled.div`
  background-color: #FFE8D6;
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
