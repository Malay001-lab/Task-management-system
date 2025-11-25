import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
  Chip,
  Button,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  People as PeopleIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);

  const getUsers = async () => {
    try {
      const { data } = await API.get("/users/stats");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const getUserTasks = async (userId) => {
    try {
      const { data } = await API.get(`/tasks/user/${userId}`);
      setUserTasks(data);
      setTasksDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch user tasks:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const totalStats = users.reduce(
    (acc, user) => ({
      totalTasks: acc.totalTasks + user.stats.totalTasks,
      completedTasks: acc.completedTasks + user.stats.completedTasks,
      totalUsers: acc.totalUsers + 1,
    }),
    { totalTasks: 0, completedTasks: 0, totalUsers: 0 }
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography
          variant="h3"
          fontWeight="700"
          color="secondary.main"
          gutterBottom
        >
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage team members and their tasks
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PeopleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {totalStats.totalUsers}
                  </Typography>
                  <Typography variant="h6">Team Members</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #ffa000 0%, #ffca28 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TaskIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {totalStats.totalTasks}
                  </Typography>
                  <Typography variant="h6">Total Tasks</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CheckCircleIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {totalStats.completedTasks}
                  </Typography>
                  <Typography variant="h6">Completed</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
              color: "white",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <PendingIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" fontWeight="700">
                    {totalStats.totalTasks - totalStats.completedTasks}
                  </Typography>
                  <Typography variant="h6">Pending</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="600"
            gutterBottom
            color="primary.main"
          >
            Team Members Performance
          </Typography>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Member</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Total Tasks</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Completed</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Pending</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Completion Rate</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Typography fontWeight="500">{user.name}</Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.stats.totalTasks}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={user.stats.completedTasks} color="success" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={user.stats.pendingTasks} color="warning" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${user.stats.completionRate}%`}
                        color={
                          user.stats.completionRate >= 80
                            ? "success"
                            : user.stats.completionRate >= 50
                            ? "warning"
                            : "error"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          getUserTasks(user._id);
                        }}
                      >
                        View Tasks
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={tasksDialogOpen}
        onClose={() => setTasksDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="primary.main">
            {selectedUser?.name}'s Tasks
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {userTasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task._id}>
                <TaskCard
                  task={task}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  showUser={false}
                />
              </Grid>
            ))}
          </Grid>

          {userTasks.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No tasks found for this user.
              </Typography>
            </Box>
          )}
        </Box>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
