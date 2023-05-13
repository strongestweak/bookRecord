import React, { FunctionComponent } from "react";

interface OwnProps {
  className?: string;
}

type Props = OwnProps;

const TextInput: FunctionComponent<Props> = ({ className = "" }) => {
  return (
    <input
      className={[
        "p-2 border rounded outline-gray-400 border-gray-300",
        className,
      ].join(" ")}
    />
  );
};

export default TextInput;
