import { useEffect, useState } from 'react';
import { getUserData } from '../../../../context/UserContext';
// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';

// menus imports dynamically
import { dashboard, hr, interviewer } from '../../../../menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const user = getUserData();
  const roles = user?.role ?? [];

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const dynamicMenus = [dashboard];

    if (roles.includes('INTERVIEWER')) {
      dynamicMenus.push(interviewer);
    }
    if (roles.includes('HR')) {
      dynamicMenus.push(hr);
    }

    setMenuItems(dynamicMenus);
  }, [roles]);

  const navItems = menuItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
