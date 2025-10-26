import React from 'react';
export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}
export declare const Button: React.FC<ButtonProps>;
export interface CardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}
export declare const Card: React.FC<CardProps>;
export interface InputProps {
    label?: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}
export declare const Input: React.FC<InputProps>;
//# sourceMappingURL=components.d.ts.map