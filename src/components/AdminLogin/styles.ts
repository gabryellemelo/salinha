import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #FFE5F1 0%, #FFE4B5 25%, #E8F4FD 50%, #F0FFF0 75%, #F8E6FF 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    pointer-events: none;
  }
`;

export const FormContainer = styled.form`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #FF69B4, #87CEEB, #98FB98, #FFB6C1);
    border-radius: 22px;
    z-index: -1;
    opacity: 0.3;
    animation: borderGlow 3s ease-in-out infinite alternate;
  }

  @keyframes borderGlow {
    0% { opacity: 0.3; }
    100% { opacity: 0.6; }
  }
`;

export const Icon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #FF69B4, #87CEEB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  animation: iconFloat 3s ease-in-out infinite;

  @keyframes iconFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const SecurityBadge = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  background: linear-gradient(45deg, #FF69B4, #FF1493);
  color: white;
  padding: 6px 10px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(255, 105, 180, 0.3);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

export const AdminTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 14px;
  color: #333;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const AdminSubtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
  font-style: italic;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

export const AdminButton = styled.button`
  background: linear-gradient(45deg, #FF69B4, #FF1493);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.8);
  color: #666;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
    color: #333;
    transform: translateY(-1px);
  }
`; 