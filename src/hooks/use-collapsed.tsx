'use client';

import * as React from "react";

const useCollapsed = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return { isCollapsed, toggleSidebar, setIsCollapsed };
};

export default useCollapsed;