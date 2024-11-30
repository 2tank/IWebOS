import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';

const Notification = ({ unreadCount }) => {
    return (
        <div className="ml-4 mr-4">
            <Badge badgeContent={unreadCount} color="secondary">
                {unreadCount > 0 ? (
                    <NotificationsIcon fontSize="large" />
                ) : (
                    <NotificationsNoneIcon fontSize="large" />
                )}
            </Badge>
        </div>
    );
};

export default Notification;
