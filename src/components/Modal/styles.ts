import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 999;
  font-family: 'Segoe UI', sans-serif;
`;


export const ModalForm = styled.form`
  background-color: #FFE8D6;
  padding: 30px 20px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  color: #333;
`;

export const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

export const ContainerButton = styled.div`
  display: flex;
  gap: 10px;
`;
