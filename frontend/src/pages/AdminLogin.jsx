import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/admin/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Admin login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 8 }}>
      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          border: "2px solid",
          borderColor: "secondary.main",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            fontWeight="700"
            color="secondary.main"
            gutterBottom
          >
            Admin Portal
          </Typography>
          <Typography variant="h5" fontWeight="600" color="text.primary">
            Administrator Access
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Restricted access - authorized personnel only
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Admin Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Admin Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #ffa000 30%, #ffca28 90%)",
                color: "white",
              }}
            >
              Access Admin Dashboard
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Regular user?{" "}
                <a
                  href="/signin"
                  style={{
                    color: "#1565c0",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  User Login
                </a>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
