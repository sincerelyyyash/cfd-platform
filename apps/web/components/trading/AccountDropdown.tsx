"use client";

import { useState } from "react";

export default function AccountDropDown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative p-2 w-60">
      <button
        className="px-2 py-1 rounded border"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Account
      </button>
      {open ? (
        <div role="menu" className="absolute mt-2 left-2 z-10 min-w-[12rem] rounded-md border bg-popover p-2 shadow-md">
          <div className="px-2 py-1.5 text-sm font-medium">My Account</div>
          <div className="-mx-2 my-1 h-px bg-border" />
          <button className="px-2 py-1.5 text-sm w-full text-left">Support</button>
          <button className="px-2 py-1.5 text-sm w-full text-left">Suggest a feature</button>
          <div className="-mx-2 my-1 h-px bg-border" />
          <button className="px-2 py-1.5 text-sm w-full text-left">Sign Out</button>
        </div>
      ) : null}
    </div>
  );
}


