// assets
import { IconPencilQuestion, IconPlus } from '@tabler/icons-react';

// constant
const icons = { IconPencilQuestion, IconPlus };

// ==============================|| INTERVIEWER MENU ITEMS ||============================== //

const dashboard = {
  id: 'interviewer',
  title: 'INTERVIEWER',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Candidate Evaluation',
      type: 'item',
      url: 'candidate-evaluation',
      icon: icons.IconPencilQuestion,
      breadcrumbs: false
    },
    {
      id: 'employee-requisition',
      title: 'Employee Requisition',
      type: 'item',
      url: 'employeeRequisition/form',
      icon: icons.IconPlus,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
