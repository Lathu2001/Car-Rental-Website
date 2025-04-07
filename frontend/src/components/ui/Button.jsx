import React from "react";

export const Button = ({ children, onClick, className }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-semibold transition ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
