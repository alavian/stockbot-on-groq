// components/ui/tabs.js

import React from "react";

export function Tabs({ children }) {
  return <div className="tabs">{children}</div>;
}

export function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>;
}

export function TabsTrigger({ children, ...props }) {
  return <button {...props} className="tabs-trigger">{children}</button>;
}

export function TabsContent({ children }) {
  return <div className="tabs-content">{children}</div>;
}
