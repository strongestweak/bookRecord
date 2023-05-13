"use client";
import { useLocation } from "@/store/location";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FolderListItem from "./FolderListItem";

interface OwnProps {}

type Props = OwnProps;

const FolderList: FunctionComponent<Props> = (props) => {
  const { locations, fetchLocation, Parents } = useLocation();

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const lastParent = useMemo(() => {
    if (!Parents || Parents?.length === 0) {
      return null;
    } else {
      return Parents[Parents.length - 1];
    }
  }, [Parents]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white rounded flex flex-1 flex-col p-2 border border-gray-200">
        {lastParent && (
          <FolderListItem
            onClick={(file) => fetchLocation(file?.Parent)}
            file={{ ...lastParent, name: "..." }}
          />
        )}
        {(locations || []).map((file) => {
          return (
            <FolderListItem
              onClick={(file) => {
                if (file.isPath) fetchLocation(file);
              }}
              key={file.id}
              file={file}
            />
          );
        })}
      </div>
    </DndProvider>
  );
};

export default FolderList;
