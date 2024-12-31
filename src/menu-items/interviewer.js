// assets
import { IconPencilQuestion } from '@tabler/icons-react';

// constant
const icons = { IconPencilQuestion };

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
    }
  ]
};

export default dashboard;
