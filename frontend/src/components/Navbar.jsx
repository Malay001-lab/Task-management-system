import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const isAdmin = user.role === "admin";

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}
        >
          TaskFlow
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={isAdmin ? "Administrator" : "User"}
            color={isAdmin ? "secondary" : "default"}
            variant="filled"
            size="small"
          />

          <Typography variant="body2">Welcome, {user.name}</Typography>

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 2,
              px: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
