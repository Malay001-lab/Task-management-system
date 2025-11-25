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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", form);
      alert("Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
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
            Join TaskFlow
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account to get started
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
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              fullWidth
              variant="outlined"
            />

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

            <FormControl fullWidth variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {form.role === "admin" && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Admin registration is restricted. Please contact system
                administrator for admin access.
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={form.role === "admin"}
              sx={{
                py: 1.5,
                background:
                  form.role === "admin"
                    ? "grey.400"
                    : "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
              }}
            >
              {form.role === "admin"
                ? "Admin Registration Disabled"
                : "Create Account"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  style={{
                    color: "#1565c0",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
