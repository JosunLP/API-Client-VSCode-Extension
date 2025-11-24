import React, { useEffect } from "react";

import SidebarGuideMenu from "../features/Sidebar/Guide/SidebarGuideMenu";
import SidebarMenu from "../features/Sidebar/Menu/SidebarMenu";

const SidebarPage = () => {
  useEffect(() => {
    console.log("SidebarPage mounted");
    console.log("vscode object available:", typeof vscode !== "undefined");
  }, []);

  return (
    <>
      <SidebarGuideMenu />
      <SidebarMenu />
    </>
  );
};

export default SidebarPage;
