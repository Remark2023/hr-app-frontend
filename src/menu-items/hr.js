// assets
import { IconDatabase, IconFileInfo, IconPlus } from '@tabler/icons-react';

// constant
const icons = { IconDatabase, IconFileInfo, IconPlus };

// ==============================|| HR MENU ITEMS ||============================== //

const dashboard = {
  id: 'hr',
  title: 'HR',
  type: 'group',
  children: [
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
    },
    {
      id: 'userAdd',
      title: 'Create Users',
      type: 'item',
      url: '/user-creation',
      icon: icons.IconPlus,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
