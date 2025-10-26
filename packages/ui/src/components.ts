// UI components for the Government Performance Management Dashboard
import React from 'react';

// Simple Button Component
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = '' }) => {
  return React.createElement(
    'button',
    {
      className: `btn btn-primary ${className}`,
      onClick: onClick,
    },
    children
  );
};

// Simple Card Component
export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  const cardContent = [];

  if (title) {
    cardContent.push(
      React.createElement(
        'div',
        { className: 'card-body' },
        React.createElement('h3', { className: 'card-title' }, title)
      )
    );
  }

  cardContent.push(React.createElement('div', { className: 'card-body' }, children));

  return React.createElement(
    'div',
    { className: `card bg-base-100 shadow-sm ${className}` },
    cardContent
  );
};

// Simple Input Component
export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
}) => {
  const inputElements = [];

  if (label) {
    inputElements.push(
      React.createElement(
        'label',
        { className: 'label' },
        React.createElement('span', { className: 'label-text' }, label)
      )
    );
  }

  inputElements.push(
    React.createElement('input', {
      type: type,
      placeholder: placeholder,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
      className: 'input input-bordered w-full',
    })
  );

  return React.createElement(
    'div',
    { className: `form-control w-full ${className}` },
    inputElements
  );
};
