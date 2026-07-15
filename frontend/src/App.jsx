import AppRoutes from "./routes/AppRoutes";
import { ChatUnreadProvider } from "./contexts/ChatUnreadContext";
import { NotificationProvider } from "./contexts/NotificationContext";

function App() {
  return (
    <ChatUnreadProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </ChatUnreadProvider>
  );
}

export default App;