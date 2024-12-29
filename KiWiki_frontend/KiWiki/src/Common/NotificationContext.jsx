import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import url from '../url.json';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${url.active_urlBase}/notification/?read=false`);
            setUnreadCount(response.data.length);
            setNotifications(response.data);
        } catch (err) {
            console.error('Error fetching unread notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications(); // Ejecutar una vez al montar
    }, []);
    

    // Polling para actualizar las notificaciones cada 5 segundos
    // useEffect(() => {
    //     fetchNotifications();

    //     const interval = setInterval(() => {
    //         fetchNotifications();
    //     }, 5000); // Intervalo de 5 segundos

    //     return () => clearInterval(interval); // Limpia el intervalo al desmontar
    // }, []);

    const markAllAsRead = async () => {
        try {
            await axios.patch(`${url.active_urlBase}/notification/read/`);
            await fetchNotifications(); // Recargar notificaciones después de marcarlas como leídas
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, notifications, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;