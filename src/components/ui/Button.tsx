// src/components/ui/Button.tsx
import styled from "styled-components";
import { theme } from "../../styles/theme";

interface ButtonProps {
  variant?: "solid" | "outline" | "ghost";
  color?: "primary" | "secondary" | "success";
  textColor?: string;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
}

const paddingMap = {
  sm: "8px 14px",
  md: "12px 18px",
  lg: "16px 24px",
};

const getButtonStyles = (color: string, variant: string) => {
  const base = theme.colors[color as keyof typeof theme.colors] || theme.colors.primary;
  const hover = theme.colors[`${color}Hover` as keyof typeof theme.colors] || theme.colors.primaryHover;

  switch (variant) {
    case "outline":
      return {
        background: "transparent",
        color: "#333",
        border: `2px solid #FFB6C1`,
        hover,
      };
    case "ghost":
      return {
        background: "transparent",
        color: "#333",
        border: "none",
        hover: "inherit",
      };
    case "solid":
    default:
      return {
        background: base,
        color: theme.colors.textLight,
        border: "none",
        hover,
      };
  }
};

const ButtonBase = styled.button<ButtonProps>`
  display: inline-block;
  padding: ${(props) => paddingMap[props.size || "md"]};
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  background: ${(props) =>
    getButtonStyles(props.color || "primary", props.variant || "solid").background};
  color: ${(props) =>
    props.textColor || getButtonStyles(props.color || "primary", props.variant || "solid").color};
  border: ${(props) => getButtonStyles(props.color || "primary", props.variant || "solid").border};

  &:hover {
    background: ${(props) =>
      getButtonStyles(props.color || "primary", props.variant || "solid").hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Button = ({ type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  return (
    <ButtonBase {...props} type={type} style={props.style}>
      {props.children}
    </ButtonBase>
  );
};

export default Button;