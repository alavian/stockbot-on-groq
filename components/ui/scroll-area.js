// components/ui/scroll-area.js

import React from "react";

export function ScrollArea({ children, ...props }) {
  return <div {...props} className="scroll-area">{children}</div>;
}
