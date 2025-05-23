/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../context/UserContext';
import Form from '../utilities/Form';

// api services
import {
  addManpowerRequisitionFromInfoService,
  getUserByUsernameService,
  getUsersBySpecificRoleService,
  manpowerRequisitionApprovalUpdateService,
  manpowerRequisitionUpdateService,
  sendApprovalRequestInfoService
} from '../../services/ApiServices.jsx';

// styles
import '../../styles/utils.css';

export default function EmployeeRequisitionFormPage({ formData: initialFormData, actionType }) {
  const user = getUserData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData || {});
  const [approvers, setApprovers] = useState([]);
  const [requester, setRequester] = useState(null);
  const [shouldResetForm, setShouldResetForm] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const formatDate = (date) => {
    if (!date) return ''; // Handle null/undefined case
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]; // Validate date
  };

  useEffect(() => {
    if (initialFormData) {
      setFormData((prevFormData) => ({
        ...prevFormData, // Ensure previous state is retained
        ...initialFormData,
        budgeted: initialFormData.isBudgeted ? ['true'] : ['false'], // Convert isBudgeted to budgeted format
        expectedJoiningDate: formatDate(initialFormData.expectedJoiningDate) || '' // Overwrite instead of adding a new key
      }));
    } else {
      setFormData({});
    }
  }, [initialFormData]);

  const fields = [
    {
      label: 'Required Position*',
      name: 'requiredPosition',
      type: 'text'
    },
    { label: 'Number of Employee*', name: 'numberOfEmployee', type: 'number' },
    { label: 'Department*', name: 'department', type: 'text' },
    { label: 'Location', name: 'location', type: 'text' },
    { label: 'Section', name: 'section', type: 'text' },
    { label: 'Sub Section', name: 'subSection', type: 'text' },
    { label: 'Expected Joining Date', name: 'expectedJoiningDate', type: 'date' },
    { label: 'Replacement of Mr./Ms.', name: 'replacementOf', type: 'text' },
    {
      label: 'Reason for Request',
      name: 'reasonForRequest',
      type: 'checkbox',
      className: 'flex items-center gap-2', // Aligns label and checkboxes in one row
      labelClassName: 'whitespace-nowrap', // Prevents label from breaking to a new line
      options: [
        { label: 'New', value: 'New' },
        { label: 'Replacement', value: 'Replacement' },
        { label: 'Others', value: 'Others' }
      ]
    },

    {
      label: 'Budgeted',
      name: 'budgeted',
      type: 'checkbox',
      className: 'flex items-center gap-4',
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ]
    },
    { label: 'Main Function', name: 'mainFunction', type: 'textarea' },
    { label: 'Role & Responsibilities*', name: 'roleAndResponsibilities', type: 'textarea' },
    { label: 'Minimum Experience', name: 'minimumExperience', type: 'number' },
    { label: 'Reports to', name: 'reportsTo', type: 'text' },
    { label: 'Minimum Education', name: 'minimumEducation', type: 'text' },
    { label: 'Education Preferred:', name: 'educationPreferred', type: 'text' },
    { label: 'Salary Range', name: 'salaryRange', type: 'number' },
    { label: 'Language proficiency', name: 'languageProficiency', type: 'text' },
    { label: 'Competency Requirements:', name: 'competencyRequirements', type: 'textarea' },
    { label: 'Computer Operation Knowledge', name: 'computerOperationKnowledge', type: 'textarea' },
    { label: 'Additional Skills, if any:', name: 'additionalSkills', type: 'textarea' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const reponse = await getUserByUsernameService(user.username);

        if (reponse.data.statusCode === 200) {
          setRequester(reponse.data.data.id);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const reponse = await getUsersBySpecificRoleService('MANPOWER REQUISITION APPROVER');

        if (reponse.data.statusCode === 200) {
          setApprovers(reponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      if (!requester) {
        return;
      }

      if (!data.requiredPosition || !data.department || !data.roleAndResponsibilities) {
        return;
      }

      const employeeRequisitionFormRequestBody = {
        location: data.location ?? '',
        requiredPosition: data.requiredPosition,
        numberOfEmployee: data.numberOfEmployee ?? 1,
        department: data.department,
        section: data.section ?? '',
        subSection: data.subSection ?? '',
        reasonForRequest: data.reasonForRequest[0] ?? '',
        isBudgeted: data.budgeted[0] ?? false,
        replacementOf: data.replacementOf ?? '',
        mainFunction: data.mainFunction ?? '',
        expectedJoiningDate: data.expectedJoiningDate ? new Date(data.expectedJoiningDate).toISOString() : '',
        roleAndResponsibilities: data.roleAndResponsibilities,
        minimumExperience: data.minimumExperience ?? '',
        reportsTo: data.reportsTo ?? '',
        minimumEducation: data.minimumEducation ?? '',
        educationPreferred: data.educationPreferred ?? '',
        salaryRange: data.salaryRange ?? '',
        languageProficiency: data.languageProficiency ?? '',
        competencyRequirements: data.competencyRequirements ?? '',
        computerOperationKnowledge: data.computerOperationKnowledge ?? '',
        additionalSkills: data.additionalSkills ?? '',
        creationDate: new Date().toISOString(),
        createdBy: { id: requester }
      };

      const showAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setTimeout(() => setAlertMessage(''), 3000);
      };

      let manpowerRequisitionResponse;
      try {
        manpowerRequisitionResponse = await addManpowerRequisitionFromInfoService(employeeRequisitionFormRequestBody, user.token);

        if (!manpowerRequisitionResponse?.data || manpowerRequisitionResponse.data.statusCode !== 200) {
          throw new Error('API request failed or returned an error.');
        }
      } catch (error) {
        showAlert('Failed to submit requisition. Please try again.', 'error');
        return;
      }

      const requisitionId = manpowerRequisitionResponse?.data?.data?.id;
      if (!requisitionId) {
        showAlert('Requisition ID not received!', 'error');
        return;
      }

      const approvalRequestBody = {
        manpowerRequisitionApprovalUniqueKey: {
          approvalOfId: requisitionId,
          approvedById: data.selectedUser
        },
        status: 'PENDING'
      };

      try {
        const approvalResponse = await sendApprovalRequestInfoService(approvalRequestBody, user.token);
        if (approvalResponse.data.statusCode === 200) {
          showAlert('Data Saved Successfully', 'success');
          setShouldResetForm(true);
        } else {
          showAlert('Process failed! Try again', 'error');
        }
      } catch (error) {
        showAlert('Approval process failed! Try again.', 'error');
      }
    } catch (error) {
      showAlert('Process failed! Please try again...', 'error');
    } finally {
      window.scrollTo(0, 0);
    }
  };

  const handleApprovalFormSubmit = async (data) => {
    try {
      if (!data.id || !requester) {
        showAlert('Invalid request data!', 'error');
        return;
      }

      const status = data.isApproved === 'Reject' ? 'REJECTED' : 'APPROVED';
      const manpowerApprovalRequisitionRequestBody = {
        manpowerRequisitionApprovalUniqueKey: {
          approvalOfId: Number(data.id),
          approvedById: Number(requester)
        },
        remarks: typeof data.remarks === 'string' && data.remarks.trim() !== '' ? data.remarks : null,
        status: status
      };

      // Function to handle API calls and return response
      const handleApiCall = async (apiFunction, requestBody) => {
        try {
          const response = await apiFunction(requestBody, user.token);
          return response?.data?.statusCode === 200 ? response : null;
        } catch (error) {
          return null;
        }
      };

      const manpowerApprovalResponse = await handleApiCall(
        manpowerRequisitionApprovalUpdateService,
        manpowerApprovalRequisitionRequestBody
      );

      if (!manpowerApprovalResponse) {
        showAlert('Approval process failed! Try again.', 'error');
        return;
      }

      let approvalRequestBody;
      if (status === 'REJECTED') {
        approvalRequestBody = {
          id: Number(data.id),
          remarks: typeof data.remarks === 'string' && data.remarks.trim() !== '' ? data.remarks : null,
          status: 'REJECTED'
        };
      } else {
        approvalRequestBody =
          data.isApproved === 'no' && data.finish === 'yes'
            ? {
                id: Number(data.id),
                remarks: typeof data.remarks === 'string' && data.remarks.trim() !== '' ? data.remarks : null,
                status: 'REJECTED'
              }
            : data.isApproved === 'no' && data.finish === undefined
              ? {
                  manpowerRequisitionApprovalUniqueKey: {
                    approvalOfId: data.id,
                    approvedById: data.selectedUser
                  },
                  status: 'PENDING'
                }
              : {
                  id: Number(data.id),
                  remarks: typeof data.remarks === 'string' && data.remarks.trim() !== '' ? data.remarks : null,
                  status: 'APPROVED'
                };
      }

      const finalApprovalResponse = await handleApiCall(
        status === 'REJECTED' || (status === 'APPROVED' && data.finish === true)
          ? manpowerRequisitionUpdateService
          : sendApprovalRequestInfoService,
        approvalRequestBody
      );

      if (finalApprovalResponse) {
        showAlert('Data Saved Successfully', 'success');
        setShouldResetForm(true);
        setTimeout(() => {
          navigate('/employeeRequisition/approval', { replace: true });
        }, 5000);
      } else {
        showAlert('Process failed! Try again.', 'error');
      }
    } catch (error) {
      showAlert('Process failed! Please try again...', 'error');
    } finally {
      window.scrollTo(0, 0);
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setTimeout(() => setAlertMessage(''), 5000);
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eef2f6' }}>
      {alertMessage && (
        <Alert variant="filled" severity={alertSeverity} className="form-max-width center-margin" style={{ marginBottom: '15px' }}>
          {alertMessage}
        </Alert>
      )}
      <div className="form-max-width center-margin">
        <Form
          fields={fields}
          initialValues={formData}
          onSubmit={(data) => {
            if (actionType === 'Approved') {
              handleApprovalFormSubmit(data);
            } else {
              handleFormSubmit(data);
            }
          }}
          userList={approvers}
          rowsConfig={[2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1]}
          actionType={actionType || 'sendToApproval'}
          resetAfterSubmit={shouldResetForm}
          readOnly={actionType === 'Approved'}
        />
      </div>
    </div>
  );
}
