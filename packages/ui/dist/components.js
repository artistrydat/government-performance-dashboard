// UI components for the Government Performance Management Dashboard
import React from 'react';
export const Button = ({ children, onClick, className = '' }) => {
    return React.createElement('button', {
        className: `btn btn-primary ${className}`,
        onClick: onClick,
    }, children);
};
export const Card = ({ children, title, className = '' }) => {
    const cardContent = [];
    if (title) {
        cardContent.push(React.createElement('div', { className: 'card-body' }, React.createElement('h3', { className: 'card-title' }, title)));
    }
    cardContent.push(React.createElement('div', { className: 'card-body' }, children));
    return React.createElement('div', { className: `card bg-base-100 shadow-sm ${className}` }, cardContent);
};
export const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', }) => {
    const inputElements = [];
    if (label) {
        inputElements.push(React.createElement('label', { className: 'label' }, React.createElement('span', { className: 'label-text' }, label)));
    }
    inputElements.push(React.createElement('input', {
        type: type,
        placeholder: placeholder,
        value: value,
        onChange: (e) => onChange?.(e.target.value),
        className: 'input input-bordered w-full',
    }));
    return React.createElement('div', { className: `form-control w-full ${className}` }, inputElements);
};
//# sourceMappingURL=components.js.map