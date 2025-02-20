// components
import ApprovedEmployeeRequisitions from '../../utilities/ApprovedEmployeeRequisitions';
import MultipleTabComponent from '../../utilities/MultipleTabsComponent';
import PendingEmployeeRequisitions from '../../utilities/PendingEmployeeRequisitions';
import RejectedEmployeeRequisitions from '../../utilities/RejectedEmployeeRequisitions';

export default function ShowEmployeeRequisitionsPage() {
  const tabComponents = [
    { label: 'APPROVED', component: <ApprovedEmployeeRequisitions /> },
    { label: 'REJECTED', component: <RejectedEmployeeRequisitions /> },
    { label: 'PENDING', component: <PendingEmployeeRequisitions /> }
  ];

  return (
    <div>
      <MultipleTabComponent componentList={tabComponents} />
    </div>
  );
}
