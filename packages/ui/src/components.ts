// UI components for the Government Performance Management Dashboard

export interface ButtonProps {
  children: string;
  onClick?: () => void;
}

export const Button = (props: ButtonProps): string => {
  return `Button: ${props.children}`;
};

export interface CardProps {
  children: string;
  title?: string;
}

export const Card = (props: CardProps): string => {
  return `Card: ${props.title || ''} - ${props.children}`;
};
