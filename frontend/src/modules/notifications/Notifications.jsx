import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Divider,
} from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import TeamLeadLayout from "../../layouts/TeamLeadLayout";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import PageHeader from "../../components/layout/PageHeader";
import GlassContainer from "../../components/layout/GlassContainer";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../hooks/useAuth";

const notificationIcons = {
  TASK_ASSIGNED: AssignmentRoundedIcon,
  TASK_ACCEPTED: TaskAltRoundedIcon,
  SOLUTION_SUBMITTED: DescriptionRoundedIcon,
  SOLUTION_APPROVED: ThumbUpRoundedIcon,
  SOLUTION_REWORK: AutorenewRoundedIcon,
  NEW_MESSAGE: ChatRoundedIcon,
  EOD_SUBMITTED: EventNoteRoundedIcon,
};

const notificationColors = {
  TASK_ASSIGNED: "#1976d2",
  TASK_ACCEPTED: "#43a047",
  SOLUTION_SUBMITTED: "#ff9800",
  SOLUTION_APPROVED: "#4caf50",
  SOLUTION_REWORK: "#f44336",
  NEW_MESSAGE: "#9c27b0",
  EOD_SUBMITTED: "#00bcd4",
};

const Notifications = ({ isTeamLead = true }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "TASK_ASSIGNED":
        navigate("/assigned-history");
        break;
      case "TASK_ACCEPTED":
        navigate("/assigned-history");
        break;
      case "SOLUTION_SUBMITTED":
        navigate("/solution-approval");
        break;
      case "SOLUTION_APPROVED":
        navigate("/employee-solution-approval");
        break;
      case "SOLUTION_REWORK":
        navigate("/employee-solution-repository");
        break;
      case "NEW_MESSAGE":
        navigate("/team-chat");
        break;
      case "EOD_SUBMITTED":
        navigate("/employee-eod");
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setSnackbar({
      open: true,
      severity: "success",
      message: "All notifications marked as read",
    });
  };

  const handleDelete = async (notificationId, event) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
    setSnackbar({
      open: true,
      severity: "success",
      message: "Notification deleted",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const Layout = isTeamLead ? TeamLeadLayout : EmployeeLayout;

  return (
    <Layout pageTitle="Notifications">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
      />

      <GlassContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
            All Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              onClick={handleMarkAllRead}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "#42A5F5",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <CheckCircleRoundedIcon fontSize="small" />
              Mark all as read
            </Box>
          )}
        </Box>

        {loading ? (
          <Box
            sx={{
              py: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
              color: "rgba(255,255,255,.6)",
            }}
          >
            <Typography variant="h6">No notifications yet</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              You're all caught up!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type] || AssignmentRoundedIcon;
              const iconColor = notificationColors[notification.type] || "#1976d2";

              return (
                <Card
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    background: notification.isRead
                      ? "rgba(255,255,255,.08)"
                      : "rgba(66,165,245,.15)",
                    backdropFilter: "blur(15px)",
                    border: notification.isRead
                      ? "1px solid rgba(255,255,255,.08)"
                      : "1px solid rgba(66,165,245,.3)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all .3s ease",
                    "&:hover": {
                      background: notification.isRead
                        ? "rgba(255,255,255,.12)"
                        : "rgba(66,165,245,.25)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                      <Avatar
                        sx={{
                          bgcolor: iconColor,
                          width: 48,
                          height: 48,
                        }}
                      >
                        <IconComponent />
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: 15,
                            }}
                          >
                            {notification.title}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{ color: "rgba(255,255,255,.6)" }}
                            >
                              {formatTime(notification.createdAt)}
                            </Typography>
                            {!notification.isRead && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "#42A5F5",
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,.8)",
                            mb: 1.5,
                            lineHeight: 1.5,
                          }}
                        >
                          {notification.message}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            label={notification.type.replace(/_/g, " ")}
                            size="small"
                            sx={{
                              bgcolor: iconColor,
                              color: "#fff",
                              fontWeight: 600,
                              fontSize: 11,
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(notification._id, e)}
                            sx={{
                              color: "rgba(255,255,255,.6)",
                              "&:hover": {
                                color: "#f44336",
                              },
                            }}
                          >
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </GlassContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ minWidth: 300 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Notifications;
