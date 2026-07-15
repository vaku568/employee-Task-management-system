import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { useNotification } from "../../contexts/NotificationContext";

const NotificationBell = ({ onClick }) => {
  const { unreadCount } = useNotification();

  return (
    <Tooltip title="Notifications" arrow>
      <IconButton
        onClick={onClick}
        sx={{
          width: 52,
          height: 52,

          borderRadius: "16px",

          color: "#ffffff",

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          background:
            "linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.08))",

          border: "1px solid rgba(255,255,255,.18)",

          boxShadow: "0 8px 25px rgba(0,0,0,.12)",

          transition: "all .30s ease",

          "&:hover": {
            transform: "translateY(-2px) scale(1.05)",

            background:
              "linear-gradient(135deg, rgba(66,165,245,.45), rgba(66,165,245,.18))",

            boxShadow: "0 12px 30px rgba(33,150,243,.35)",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          overlap="circular"
          invisible={unreadCount === 0}
          sx={{
            "& .MuiBadge-badge": {
              fontWeight: 700,
              minWidth: 20,
              height: 20,
              fontSize: 11,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              animation:
                unreadCount > 0 ? "notificationRing 1.8s infinite" : "none",

              "@keyframes notificationRing": {
                "0%": {
                  transform: "rotate(0deg)",
                },
                "10%": {
                  transform: "rotate(15deg)",
                },
                "20%": {
                  transform: "rotate(-15deg)",
                },
                "30%": {
                  transform: "rotate(12deg)",
                },
                "40%": {
                  transform: "rotate(-12deg)",
                },
                "50%": {
                  transform: "rotate(8deg)",
                },
                "60%": {
                  transform: "rotate(-8deg)",
                },
                "70%": {
                  transform: "rotate(4deg)",
                },
                "80%": {
                  transform: "rotate(-4deg)",
                },
                "100%": {
                  transform: "rotate(0deg)",
                },
              },
            }}
          >
            <NotificationsRoundedIcon
              sx={{
                fontSize: 28,
              }}
            />
          </Box>
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationBell;