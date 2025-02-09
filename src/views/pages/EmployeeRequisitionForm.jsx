/* eslint-disable no-unused-vars */
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../context/UserContext';
import Form from '../utilities/Form';

// components
import AuthFooter from 'ui-component/cards/AuthFooter';

// api services
import {
  addManpowerRequisitionFromInfoService,
  getUserByUsernameService,
  getUsersBySpecificRoleService,
  sendApprovalRequestInfoService
} from '../../services/ApiServices.jsx';

// styles
import '../../styles/utils.css';

export default function EmployeeRequisitionFormPage() {
  const navigate = useNavigate();
  const user = getUserData();
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState({});
  const [username, setUsername] = useState({});
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [candidateExperienceList, setCandidateExperienceList] = useState([{ experienceField: '', organization: '', years: '' }]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const [shouldResetForm, setShouldResetForm] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const fields = [
    { label: 'Required Position', name: 'requiredPosition', type: 'text' },
    { label: 'Number of Employee', name: 'numberOfEmployee', type: 'number' },
    { label: 'Department', name: 'department', type: 'text' },
    { label: 'Section', name: 'section', type: 'text' },
    { label: 'Sub Section', name: 'subSection', type: 'text' },
    { label: 'Expected Joining Date', name: 'expectedJoiningDate', type: 'date' },

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
      className: 'flex items-center gap-4', // Ensures inline layout
      options: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' }
      ]
    },

    { label: 'Replacement of Mr./Ms.', name: 'replacementOfMrMs', type: 'text' },
    { label: 'Main Function', name: 'mainFunction', type: 'text' },
    { label: 'Role & Responsibilities', name: 'roleResponsibilities', type: 'textarea' },
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
          setUsername(reponse.data.data.id);
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
        console.log(reponse.data.data);

        if (reponse.data.statusCode === 200) {
          setUsers(reponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      // Constructing the request body as per your required format
      const employeeRequisitionFormRequestBody = {
        location: data.location ?? '',
        requiredPosition: data.requiredPosition ?? '',
        numberOfEmployee: data.numberOfEmployee ?? '',
        department: data.department ?? '',
        section: data.section ?? '',
        subSection: data.subSection ?? '',
        reasonForRequest: data.reasonForRequest[0] ?? '',
        isBudgeted: data.budgeted[0] ?? '', // Convert to boolean
        replacementOf: data.replacementOfMrMs ?? '',
        mainFunction: data.mainFunction ?? '',
        expectedJoiningDate: data.expectedJoiningDate ? new Date(data.expectedJoiningDate).toISOString() : '',
        roleAndResponsibilities: data.roleResponsibilities ?? '',
        minimumExperience: data.minimumExperience ?? '',
        reportsTo: data.reportsTo ?? '',
        minimumEducation: data.minimumEducation ?? '',
        educationPreferred: data.educationPreferred ?? '',
        salaryRange: data.salaryRange ?? '',
        languageProficiency: data.languageProficiency ?? '',
        competencyRequirements: data.competencyRequirements ?? '',
        computerOperationKnowledge: data.computerOperationKnowledge ?? '',
        additionalSkills: data.additionalSkills ?? '',
        creationDate: new Date().toISOString(), // Current timestamp
        createdBy: {
          id: username // Assuming `user.id` is available
        }
      };
      // Sending the request
      const manpowerRequisitionResponse = await addManpowerRequisitionFromInfoService(employeeRequisitionFormRequestBody, user.token);

      // Extracting the ID from the response
      const requisitionId = manpowerRequisitionResponse?.data?.data?.id;

      if (requisitionId) {
        const approvalRequestBody = {
          manpowerRequisitionApprovalUniqueKey: {
            approvalOfId: requisitionId,
            approvedById: data.selectedUser
          },
          status: 'PENDING' // Assuming initial status
        };
        // Sending the second request
        const approvalResponse = await sendApprovalRequestInfoService(approvalRequestBody, user.token);

        if (approvalResponse.data.statusCode === 200) {
          alert('Data Saved Successfully');
          setAlertMessage('Data Saved Successfully');
          setAlertSeverity('success');
          setShouldResetForm(true); // Reset the form after success
          // Reset form values only after successful submission
          setFormValues({}); // Empty out the form fields
          setTimeout(() => {
            setAlertMessage('');
          }, 3000); // Alert message disappears after 3 seconds
        } else {
          alert('Process failed! Try again');
          setAlertMessage('Process failed! Try again');
          setAlertSeverity('error');
          setShouldResetForm(false);
          setTimeout(() => {
            setAlertMessage('');
          }, 3000); // Alert message disappears after 3 seconds
        }
      }

      // You can use requisitionId for further logic here (e.g., navigation, storing in state)
    } catch (error) {
      alert('Process failed! Try again');
      setAlertMessage('Process failed! Please try again...');
      setAlertSeverity('error');
      setShouldResetForm(false);
      setTimeout(() => {
        setAlertMessage('');
      }, 1000);
    }
  };

  const responsiveStyles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    row: { display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    field: {
      flex: '1 1 calc(20% - 12px)',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      boxSizing: 'border-box'
    },
    label: { fontWeight: 'bold', fontSize: '14px', textAlign: 'left' },
    input: { padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    button: {
      padding: '15px',
      marginTop: '15px',
      width: '100%',
      backgroundColor: '#5b2c6f',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      textAlign: 'center'
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eef2f6' }}>
      {alertMessage && (
        <Alert variant="filled" severity={alertSeverity}>
          {alertMessage}
        </Alert>
      )}
      <div hidden={showExperienceForm} className="form-max-width center-margin">
        <h2>
          REMARK HB LIMITED <br /> <br />
          EMPLOYEE REQUISITION FORM
        </h2>

        <Form
          fields={fields}
          initialValues={formData}
          onSubmit={handleFormSubmit}
          userList={users}
          rowsConfig={[2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1]}
          actionType="sendToApproval"
          resetAfterSubmit={shouldResetForm}
        />
      </div>

      <AuthFooter />
    </div>
  );
}
