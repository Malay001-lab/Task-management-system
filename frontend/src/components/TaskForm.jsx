import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import API from "../api/axios";

const TaskForm = ({ editingTask, onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "",
      });
    }
  }, [editingTask]);

  const handleSubmit = async () => {
    try {
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, form);
      } else {
        await API.post("/tasks", form);
      }
      onClose();
    } catch (err) {
      alert("Failed to save task");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="600"
        gutterBottom
        color="primary.main"
      >
        {editingTask ? "Edit Task" : "Create New Task"}
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          fullWidth
          required
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          fullWidth
          multiline
          rows={3}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Status"
            select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <TextField
            label="Priority"
            select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            fullWidth
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
        </Stack>

        <TextField
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
            }}
          >
            {editingTask ? "Update Task" : "Create Task"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TaskForm;
