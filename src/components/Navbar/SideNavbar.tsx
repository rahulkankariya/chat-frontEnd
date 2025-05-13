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
              onClick={() => navigate(item.path)}
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