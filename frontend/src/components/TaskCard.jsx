import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const PriorityChip = ({ priority }) => {
  const colorMap = {
    High: "error",
    Medium: "warning",
    Low: "info",
  };

  return (
    <Chip
      label={priority}
      size="small"
      color={colorMap[priority]}
      variant="outlined"
    />
  );
};

const StatusChip = ({ status }) => {
  const colorMap = {
    Completed: "success",
    "In Progress": "primary",
    Pending: "default",
  };

  return <Chip label={status} size="small" color={colorMap[status]} />;
};

const TaskCard = ({ task, onEdit, onDelete, showUser = false }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px 0 rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography variant="h6" fontWeight="600" color="primary.main">
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <PriorityChip priority={task.priority} />
            <StatusChip status={task.status} />
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {task.description}
        </Typography>

        {showUser && task.user && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {task.user.name}
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="caption" color="text.secondary">
            Due:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            {(isAdmin || task.user?._id === user.id) && (
              <IconButton
                size="small"
                onClick={() => onDelete(task._id)}
                sx={{ color: "secondary.main" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
