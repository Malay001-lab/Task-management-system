import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Dialog,
  Box,
  Stack,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import PaginationBar from "../components/PaginationBar";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getTasks = async (pg = 1) => {
    try {
      const { data } = await API.get(`/tasks?page=${pg}&limit=8`);
      setTasks(data.tasks);
      setPage(data.page);
      setPages(data.pages);

      const completed = data.tasks.filter(
        (task) => task.status === "Completed"
      ).length;
      const pending = data.tasks.filter(
        (task) => task.status !== "Completed"
      ).length;
      setStats({
        total: data.total,
        completed,
        pending,
      });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      getTasks(page);
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="700"
            color="primary.main"
            gutterBottom
          >
            Welcome, {user.name}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your tasks efficiently
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingTask(null);
            setOpen(true);
          }}
          sx={{
            px: 3,
            py: 1.5,
            background: "linear-gradient(45deg, #1565c0 30%, #42a5f5 90%)",
          }}
        >
          New Task
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="h6">Total Tasks</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #ffa000 0%, #ffca28 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {stats.completed}
              </Typography>
              <Typography variant="h6">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #42a5f5 0%, #90caf9 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="700" gutterBottom>
                {stats.pending}
              </Typography>
              <Typography variant="h6">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={task._id}>
            <TaskCard
              task={task}
              onEdit={(task) => {
                setEditingTask(task);
                setOpen(true);
              }}
              onDelete={deleteTask}
              showUser={user.role === "admin"}
            />
          </Grid>
        ))}
      </Grid>

      {tasks.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary">
            No tasks found. Create your first task!
          </Typography>
        </Box>
      )}

      <PaginationBar page={page} pages={pages} onChange={getTasks} />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <TaskForm
          editingTask={editingTask}
          onClose={() => {
            setOpen(false);
            getTasks(page);
          }}
        />
      </Dialog>
    </Container>
  );
};

export default Dashboard;
