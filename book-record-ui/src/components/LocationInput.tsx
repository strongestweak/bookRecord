"use client";

import React, {
  forwardRef,
  FunctionComponent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface OwnProps {
  onChange?: (location: string[]) => void;
  className?: string;
}

type Props = OwnProps;

export interface LocationInputRef {
  reset: () => void;
}

const LocationInput = forwardRef<LocationInputRef, Props>(
  ({ onChange, className }, ref) => {
    const [locations, setLocations] = useState<string[]>([]);
    const [edit, setEdit] = useState<string>("");

    useEffect(() => {
      const finalLocation = [...locations];
      if (edit !== "") {
        finalLocation.push(edit);
      }
      if (onChange) {
        onChange(finalLocation);
      }
    }, [locations, edit, onChange]);

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === "Enter" || e.code === "Tab") {
          setLocations((val) => [...val, edit]);
          setEdit("");
          e.preventDefault();
        }
      },
      [edit]
    );

    const onLocationChange = useCallback((index: number) => {
      return (e: React.FormEvent<HTMLParagraphElement>) => {
        const textContent = e.currentTarget?.textContent || "";
        setLocations((val) => {
          const cVal = [...val];
          cVal[index] = textContent;
          console.log([...cVal].filter((e) => e && e.trim() !== ""));
          return [...cVal].filter((e) => e && e.trim() !== "");
        });
      };
    }, []);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setLocations([]);
        setEdit("");
      },
    }));

    return (
      <>
        <div
          className={
            "rounded border border-gray-300 flex flex-1 gap-2 flex-wrap bg-white " +
            (className || "")
          }
        >
          {locations.map((location, index) => {
            const isLast = index === locations.length - 1;
            return (
              <div
                key={`location-text-${index}`}
                className="gap-2 flex pl-2 flex-row items-center"
              >
                <p
                  contentEditable="true"
                  onKeyDown={onLocationChange(index)}
                  onInput={onLocationChange(index)}
                  className="max-w-[300px]"
                >
                  {location}
                </p>
                {!isLast || edit !== "" ? <div>{">"}</div> : null}
              </div>
            );
          })}
          <input
            className="border-0 p-2 outline-0 rounded border-gray-500 flex-1 min-w-[50px] font-bold"
            value={edit}
            onChange={(e) => setEdit(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      </>
    );
  }
);

LocationInput.displayName = "Location Input";

export default LocationInput;
