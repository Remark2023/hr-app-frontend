// assets
import { IconRegistered } from '@tabler/icons-react';

// constant
const icons = { IconRegistered };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const admin = {
  id: 'admin',
  title: 'ADMIN',
  type: 'group',
  children: [
    {
      id: 'signupApproval',
      title: 'Signup Approval',
      type: 'item',
      url: '/signup-approval',
      icon: icons.IconRegistered,
      breadcrumbs: false
    }
  ]
};

export default admin;
