// assets
import { IconAlignRight, IconDatabase, IconFileInfo, IconList, IconPlus } from '@tabler/icons-react';

// constant
const icons = { IconDatabase, IconFileInfo, IconPlus, IconAlignRight, IconList };

// ==============================|| HR MENU ITEMS ||============================== //

const dashboard = {
  id: 'hr',
  title: 'HR',
  type: 'group',
  children: [
    {
      id: 'displayEmployeRequisitions',
      title: 'Employe Requisitions',
      type: 'item',
      url: '/employeeRequisition/show',
      icon: icons.IconList,
      breadcrumbs: false
    },
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
    },
    {
      id: 'role-assignment',
      title: 'Role Assignment',
      type: 'item',
      url: 'role-assignment',
      icon: icons.IconAlignRight,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
