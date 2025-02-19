// assets
import {
  IconBrandChrome,
  IconDatabase,
  IconFileInfo,
  IconHelp,
  IconPalette,
  IconPencilQuestion,
  IconShadow,
  IconTypography,
  IconWindmill
} from '@tabler/icons-react';

// constant
const icons = {
  IconBrandChrome,
  IconHelp,
  IconDatabase,
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconFileInfo,
  IconPencilQuestion
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const OtherMenu = () => {
  const menus = [];
  // to add menus dynamically based to roles change in the layout -> sidebar -> MenuList -> index.jsx file

  const other = {
    id: 'sample-docs-roadmap',
    title: 'Interview',
    type: 'group',
    children: menus
  };

  return other;
};

export default OtherMenu;
