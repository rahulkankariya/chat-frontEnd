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
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, route: 'Dashboard', path: '/dashboard' },
  { label: 'Messages', icon: <MessageIcon />, route: 'Messages', path: '/messages' },
  { label: 'Profile', icon: <PersonIcon />, route: 'Profile', path: '/profile' },
  { label: 'Requests', icon: <MailIcon />, route: 'Requests', path: '/requests' },
  { label: 'Notifications', icon: <NotificationsIcon />, route: 'Notifications', path: '/notifications' },
  { label: 'Settings', icon: <SettingsIcon />, route: 'Settings', path: '/settings' },
  { label: 'Logout', icon: <LogoutIcon />, route: 'Logout', path: '/logout' },
];

interface SideNavProps {
  activeRoute?: string;
}

const SideNav: React.FC<SideNavProps> = ({ activeRoute }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: { xs: 'fixed', md: 'relative' },
        bottom: { xs: 0, md: 'auto' },
        left: { xs: 0, md: 'auto' },
        width: { xs: '100%', md: 72 },
        height: { xs: 64, md: '100vh' },
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTop: { xs: '1px solid #ddd', md: 'none' },
        borderRight: { md: '1px solid #ddd' },
        zIndex: 20,
      }}
    >
   {menuItems.map((item) => (
  <Tooltip key={item.label} title={item.label} placement="top">
    <IconButton
      onClick={() => navigate(item.path)}
      sx={{
        mx: { xs: 1, md: 0 },
        my: { xs: 0, md: 1 },
        color: item.route === activeRoute ? '#3A60AE' : 'grey.600',
        bgcolor: item.route === activeRoute ? 'rgba(58, 96, 174, 0.1)' : 'transparent',
        borderRadius: '12px',
        '&:hover': {
          bgcolor: 'rgba(58, 96, 174, 0.2)',
        },
        '& svg': {
          fontSize: { xs: '15px', sm:"20px", md: '24px' }, // responsive icon size
        },
      }}
    >
      {item.icon}
    </IconButton>
  </Tooltip>
))}

    </Box>
  );
};

export default SideNav;
