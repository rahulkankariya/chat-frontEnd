import React from 'react';
import {
  Dashboard as DashboardIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, route: 'Dashboard' },
  { label: 'Messages', icon: <MessageIcon />, route: 'Messages' },
  { label: 'Profile', icon: <PersonIcon />, route: 'Profile' },
  { label: 'Requests', icon: <MailIcon />, route: 'Requests' },
  { label: 'Notifications', icon: <NotificationsIcon />, route: 'Notifications' },
  { label: 'Settings', icon: <SettingsIcon />, route: 'Settings' },
  { label: 'Logout', icon: <LogoutIcon />, route: 'Logout' },
];

interface SideNavProps {
  activeRoute?: string; // Current active route
}

const SideNav: React.FC<SideNavProps> = ({ activeRoute }) => {
  console.log("Route==?",activeRoute)
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 72 },
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: { sm: '1px solid #ddd' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {menuItems.map((item) => (
          <Tooltip key={item.label} title={item.label} placement="right">
            <IconButton
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                color: item.route === activeRoute ? '#3A60AE' : 'grey.600',
                bgcolor: item.route === activeRoute ? 'rgba(58, 96, 174, 0.1)' : 'transparent',
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: 'rgba(58, 96, 174, 0.2)',
                },
              }}
              aria-label={item.label}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default SideNav;