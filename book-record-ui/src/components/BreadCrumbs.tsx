import { useLocation } from "@/store/location";
import { FileItem } from "@/types";
import React, { FunctionComponent, useMemo } from "react";

interface OwnProps {
  // Add some types here
  temp?: any;
}

type Props = OwnProps;

const BreadCrumbs: FunctionComponent<Props> = (props) => {
  const { Parents, fetchLocation } = useLocation();
  const cleanParents = useMemo(
    () => [{ name: "Root" } as FileItem].concat(Parents || []).filter((e) => e),
    [Parents]
  );
  return (
    <div>
      <ul className="flex flex-row gap-2">
        {cleanParents.map((e) => {
          return (
            <ol key={e.name}>
              <a
                href="#"
                onClick={() => {
                  fetchLocation(e.id ? e : undefined);
                }}
              >
                {e.name}
              </a>
              <span className="px-2">/</span>
            </ol>
          );
        })}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
