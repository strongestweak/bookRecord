"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import React, { FunctionComponent, useEffect, useState } from "react";
import AddForm from "./components/AddForm";
import FolderList from "./components/FolderList";

interface OwnProps {}

type Props = OwnProps;

const Home: FunctionComponent<Props> = (props) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <span className="text-xl">Loading</span>;
  }
  return (
    <div className="bg-gray-100 flex flex-1 items-start flex-col">
      <div className="p-4 w-full flex flex-1 flex-col gap-4">
        <AddForm className="w-full" />
        <BreadCrumbs />
        <FolderList />
      </div>
    </div>
  );
};

export default Home;
