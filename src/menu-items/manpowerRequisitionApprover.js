// assets
import { IconList } from '@tabler/icons-react';

// constant
const icons = { IconList };

// ==============================|| INTERVIEWER MENU ITEMS ||============================== //

const dashboard = {
  id: 'employeeRequisitionApprover',
  title: 'Employee Requisition Approver',
  type: 'group',
  children: [
    {
      id: 'employee-requisition-approval',
      title: 'Approval List',
      type: 'item',
      url: 'employeeRequisition/approavl',
      icon: icons.IconList,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
