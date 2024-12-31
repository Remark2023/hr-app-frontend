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
import { getUserData } from '../context/UserContext';

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
  const user = getUserData();
  const roles = user?.role ?? [];
  const menus = [];

  if (roles.includes('INTERVIEWER')) {
    menus.push({
      id: 'sample-page',
      title: 'Candidate Evaluation',
      type: 'item',
      url: 'candidate-evaluation',
      icon: icons.IconPencilQuestion,
      breadcrumbs: false
    });
  }

  if (roles.includes('HR')) {
    menus.push(
      {
        id: 'documentation',
        title: 'Candidate Facilities',
        type: 'item',
        url: 'hr-entry-form',
        icon: icons.IconDatabase,
        breadcrumbs: false
      },
      {
        id: 'dataTable',
        title: 'Candidate Information',
        type: 'item',
        url: '/utils/data-table',
        icon: icons.IconFileInfo,
        breadcrumbs: false
      }
    );
  }

  const other = {
    id: 'sample-docs-roadmap',
    title: 'Interview',
    type: 'group',
    children: menus
  };

  return other;
};

export default OtherMenu;
