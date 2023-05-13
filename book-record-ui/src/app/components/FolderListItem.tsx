import { FileItem } from "@/types";
import { MdOutlineFolder, MdInsertDriveFile, MdOpenWith } from "react-icons/md";
import { CgTrashEmpty } from "react-icons/cg";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useLocation } from "@/store/location";

interface OwnProps {
  file: FileItem;
  onClick?: (file: FileItem) => void;
}

type Props = OwnProps;

const FolderListItem: FunctionComponent<Props> = ({ file, onClick }) => {
  const { updateLocation, Parents } = useLocation();
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "FileItem",
      item: file,
      end: (dragItem, monitor) => {
        const dropItem = monitor.getDropResult<FileItem>();
        if (dragItem && dropItem) {
          if (dropItem?.id !== dragItem.id) {
            updateLocation({
              ...dragItem,
              ParentId:
                dropItem.name === "..." ? dropItem?.ParentId : dropItem.id,
            });
          }
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }),
    [file]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "FileItem",
      drop: () => file,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [file]
  );

  const opacity = useMemo(() => (isDragging ? 0.4 : 1), [isDragging]);

  const trash = useCallback(() => {
    const confirmValue = confirm("Are you sure you want to delete this item?");
    if (confirmValue) {
      updateLocation(file, true);
    }
  }, [file]);

  return drag(
    drop(
      <div
        style={{ opacity }}
        className="p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer flex flex-row justify-between"
        onClick={() => {
          onClick && onClick(file);
        }}
      >
        <div className="flex flex-row items-center gap-4">
          {file.isPath ? <MdOutlineFolder /> : <MdInsertDriveFile />}
          {file.name}
        </div>
        {!file.isPath && (
          <div className="flex flex-row items-center gap-4">
            <MdOpenWith />
            <div className="p-2" onClick={trash}>
              <CgTrashEmpty />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default FolderListItem;
