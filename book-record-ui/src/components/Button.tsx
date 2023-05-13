import React, { ButtonHTMLAttributes, FunctionComponent } from "react";

interface OwnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

type Props = OwnProps;

const Button: FunctionComponent<Props> = ({ label, className, ...props }) => {
  return (
    <button
      className={
        "bg-violet-500 hover:bg-violet-600 active:bg-violet-700 p-2 rounded text-white cursor-pointer border " +
        (className || "")
      }
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
