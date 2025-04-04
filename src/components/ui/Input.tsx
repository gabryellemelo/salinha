// src/components/ui/Input.tsx
import styled from "styled-components";

interface InputProps {
  width?: string;
  margin?: string;
  padding?: string;
  fontSize?: string;
  radius?: string;
  color?: string;
  background?: string;
}

const Input = styled.input<InputProps>`
  width: ${(props) => props.width || "100%"};
  margin: ${(props) => props.margin || "0"};
  padding: ${(props) => props.padding || "14px"};
  font-size: ${(props) => props.fontSize || "15px"};
  border-radius: ${(props) => props.radius || "10px"};
  border: 1px solid #ccc;
  background-color: ${(props) => props.background || "#fff"};
  color: ${(props) => props.color || "#333"};
  outline: none;
  box-sizing: border-box;
`;

export default Input;