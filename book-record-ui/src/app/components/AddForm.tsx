"use client";
import Button from "@/components/Button";
import LocationInput, { LocationInputRef } from "@/components/LocationInput";
import TextInput from "@/components/TextInput";
import { useLocation } from "@/store/location";
import React, {
  createRef,
  FunctionComponent,
  useCallback,
  useState,
} from "react";

interface OwnProps {
  className?: string;
}

type Props = OwnProps;

const AddForm: FunctionComponent<Props> = ({ className }) => {
  const locationInputRef = createRef<LocationInputRef>();
  const [locations, setLocations] = useState<string[]>([]);
  const { createLocations } = useLocation();

  const addLocation = useCallback(
    (isPath: boolean) => {
      return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        createLocations(locations, isPath);
        if (locationInputRef.current) {
          locationInputRef.current.reset();
        }
      };
    },
    [createLocations, locationInputRef, locations]
  );

  return (
    <div
      className={
        "flex md:flex-row items-center gap-2 flex-col " + (className || "")
      }
    >
      <LocationInput
        ref={locationInputRef}
        onChange={setLocations}
        className="w-full md:w-auto"
      />
      <Button
        type="button"
        label="Add Location"
        onClick={addLocation(true)}
        className="w-full md:w-auto"
      />
      <Button
        type="button"
        label="Add Book"
        onClick={addLocation(false)}
        className="w-full md:w-auto"
      />
    </div>
  );
};

export default AddForm;
