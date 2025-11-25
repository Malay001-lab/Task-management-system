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
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
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
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            fontWeight="700"
            color="primary.main"
            gutterBottom
          >
            TaskFlow
          </Typography>
          <Typography variant="h5" fontWeight="600" color="text.primary">
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to manage your tasks
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
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Password"
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
                background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
              }}
            >
              Sign In
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "#1565c0",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                Admin?{" "}
                <Link
                  to="/admin/login"
                  style={{
                    color: "#ffa000",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Admin Login
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
