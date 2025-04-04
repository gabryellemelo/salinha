// src/components/ui/Typography.tsx
import styled from "styled-components";

interface TypographyProps {
  size?: string;
  weight?: number | string;
  color?: string;
  align?: "left" | "center" | "right";
  margin?: string;
  lineHeight?: string;
}

const Typography = styled.p<TypographyProps>`
  font-size: ${(props) => props.size || "16px"};
  font-weight: ${(props) => props.weight || 400};
  color: ${(props) => props.color || "#333"};
  text-align: ${(props) => props.align || "left"};
  margin: ${(props) => props.margin || "0"};
  line-height: ${(props) => props.lineHeight || "normal"};
`;

export default Typography;
