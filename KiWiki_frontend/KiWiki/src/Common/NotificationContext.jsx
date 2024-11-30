import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://localhost:8000/notification/?read=false");
                setUnreadCount(response.data.length);
                setNotifications(response.data); // Guardar todas las notificaciones
            } catch (err) {
                console.error("Error fetching unread notifications:", err);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
