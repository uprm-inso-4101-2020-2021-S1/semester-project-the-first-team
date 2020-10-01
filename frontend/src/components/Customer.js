import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { CustomerSidebarItems } from "./CustomerSidebarItems";

function Customer() {
  const [sidebarItems] = useState(CustomerSidebarItems);

  return (
    <>
      <Sidebar items={sidebarItems} />
    </>
  );
}

export default Customer;
