import React from "react";
import { IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeSwitcher({ mode, setMode }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999 }}>
      <IconButton
        onClick={() => setMode(mode === "light" ? "dark" : "light")}
        color="inherit"
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </div>
  );
}
