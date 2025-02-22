/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
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

  const [formData, setFormData] = useState(initialFormData || {});
  const [approvers, setApprovers] = useState([]);
  const [requester, setRequester] = useState(null);
  const [shouldResetForm, setShouldResetForm] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  console.log(formData);
  useEffect(() => {
    if (initialFormData) {
      setFormData({
        ...initialFormData,
        budgeted: initialFormData.isBudgeted ? ['true'] : ['false'] // Convert isBudgeted to budgeted format
      });
    } else {
      setFormData({});
    }
  }, [initialFormData]);

  console.log(formData);
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
    { label: 'Replacement of Mr./Ms.', name: 'replacementOfMrMs', type: 'text' },
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
    { label: 'Role & Responsibilities*', name: 'roleResponsibilities', type: 'textarea' },
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
    console.log(data);

    try {
      if (!requester) {
        alert('Process failed! Try again');
        return;
      }

      // if (data.requiredPosition || data.department || data.roleResponsibilities) {
      //   alert('Please enter the required fields!');
      //   return;
      // }

      const employeeRequisitionFormRequestBody = {
        location: data.location ?? '',
        requiredPosition: data.requiredPosition,
        numberOfEmployee: data.numberOfEmployee ?? 1,
        department: data.department,
        section: data.section ?? '',
        subSection: data.subSection ?? '',
        reasonForRequest: data.reasonForRequest[0] ?? '',
        isBudgeted: data.budgeted[0] ?? false,
        replacementOf: data.replacementOfMrMs ?? '',
        mainFunction: data.mainFunction ?? '',
        expectedJoiningDate: data.expectedJoiningDate ? new Date(data.expectedJoiningDate).toISOString() : '',
        roleAndResponsibilities: data.roleResponsibilities,
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
        createdBy: {
          id: requester
        }
      };

      // Declare the response variable outside so it's accessible later
      let manpowerRequisitionResponse;

      try {
        manpowerRequisitionResponse = await addManpowerRequisitionFromInfoService(employeeRequisitionFormRequestBody, user.token);

        if (!manpowerRequisitionResponse || !manpowerRequisitionResponse.data || manpowerRequisitionResponse.data.statusCode !== 200) {
          throw new Error('API request failed or returned an error.');
        }
      } catch (error) {
        console.error('API Error:', error);
        return; // Stop execution if API call fails
      }

      const requisitionId = manpowerRequisitionResponse?.data?.data?.id;

      if (requisitionId) {
        const approvalRequestBody = {
          manpowerRequisitionApprovalUniqueKey: {
            approvalOfId: requisitionId,
            approvedById: data.selectedUser
          },
          status: 'PENDING'
        };
        console.log('Sending Approval Request:', approvalRequestBody);

        try {
          const approvalResponse = await sendApprovalRequestInfoService(approvalRequestBody, user.token);
          console.log('Approval Response:', approvalResponse);

          if (approvalResponse.data.statusCode === 200) {
            alert('Data Saved Successfully');
            setAlertMessage('Data Saved Successfully');
            setAlertSeverity('success');
            setShouldResetForm(true); // Reset the form after success
            setFormValues({}); // Empty out the form fields
            setTimeout(() => {
              setAlertMessage('');
            }, 3000);
          } else {
            alert('Process failed! Try again');
            setAlertMessage('Process failed! Try again');
            setAlertSeverity('error');
            setShouldResetForm(false);
            setTimeout(() => {
              setAlertMessage('');
            }, 3000);
          }
        } catch (error) {
          console.error('Approval API Error:', error);
        }
      }
    } catch (error) {
      setAlertMessage('Process failed! Please try again...');
      setAlertSeverity('error');
      setShouldResetForm(false);
      setTimeout(() => {
        setAlertMessage('');
      }, 1000);
    }
  };

  const handleApprovalFormSubmit = async (data) => {
    if (data.isApproved === 'no') {
      try {
        const manpowerApprovalRequisitionRequestBody = {
          manpowerRequisitionApprovalUniqueKey: {
            approvalOfId: Number(data.id), // Ensuring it's a Number
            approvedById: Number(requester) // Ensuring it's a Number
          },
          remarks: String(data.remarks), // Ensuring it's a String
          status: String('APPROVED') // Ensuring it's a String
        };

        const manpowerApprovalRequisitionResponse = await manpowerRequisitionApprovalUpdateService(
          manpowerApprovalRequisitionRequestBody,
          user.token
        );

        // const requisitionId = manpowerApprovalRequisitionResponse?.data?.data?.id;

        if (manpowerApprovalRequisitionResponse.data.statusCode === 200) {
          const approvalRequestBody = {
            manpowerRequisitionApprovalUniqueKey: {
              approvalOfId: data.id,
              approvedById: data.selectedUser
            },
            status: 'PENDING'
          };
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
      } catch (error) {
        // alert('Process failed! Try again');
        setAlertMessage('Process failed! Please try again...');
        setAlertSeverity('error');
        setShouldResetForm(false);
        setTimeout(() => {
          setAlertMessage('');
        }, 1000);
      }
    } else if (data.isApproved === 'Reject') {
      try {
        const manpowerApprovalRequisitionRequestBody = {
          manpowerRequisitionApprovalUniqueKey: {
            approvalOfId: Number(data.id), // Ensuring it's a Number
            approvedById: Number(requester) // Ensuring it's a Number
          },
          remarks: String(data.remarks), // Ensuring it's a String
          status: String('REJECTED') // Ensuring it's a String
        };

        const manpowerApprovalRequisitionResponse = await manpowerRequisitionApprovalUpdateService(
          manpowerApprovalRequisitionRequestBody,
          user.token
        );

        // const requisitionId = manpowerApprovalRequisitionResponse?.data?.data?.id;

        if (manpowerApprovalRequisitionResponse.data.statusCode === 200) {
          const approvalRequestBody = {
            id: Number(data.id), // Ensuring it's a Number
            remarks: String(data.remarks), // Ensuring it's a String
            status: String('REJECTED') // Ensuring it's a String
          };

          const approvalResponse = await manpowerRequisitionUpdateService(approvalRequestBody, user.token);

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
      } catch (error) {
        // alert('Process failed! Try again');
        setAlertMessage('Process failed! Please try again...');
        setAlertSeverity('error');
        setShouldResetForm(false);
        setTimeout(() => {
          setAlertMessage('');
        }, 1000);
      }
    } else {
      try {
        const manpowerApprovalRequisitionRequestBody = {
          manpowerRequisitionApprovalUniqueKey: {
            approvalOfId: Number(data.id), // Ensuring it's a Number
            approvedById: Number(requester) // Ensuring it's a Number
          },
          remarks: String(data.remarks), // Ensuring it's a String
          status: String('APPROVED') // Ensuring it's a String
        };

        const manpowerApprovalRequisitionResponse = await manpowerRequisitionApprovalUpdateService(
          manpowerApprovalRequisitionRequestBody,
          user.token
        );

        // const requisitionId = manpowerApprovalRequisitionResponse?.data?.data?.id;

        if (manpowerApprovalRequisitionResponse.data.statusCode === 200) {
          const approvalRequestBody = {
            id: Number(data.id), // Ensuring it's a Number
            remarks: String(data.remarks), // Ensuring it's a String
            status: String('APPROVED') // Ensuring it's a String
          };

          const approvalResponse = await manpowerRequisitionUpdateService(approvalRequestBody, user.token);

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
      } catch (error) {
        // alert('Process failed! Try again');
        setAlertMessage('Process failed! Please try again...');
        setAlertSeverity('error');
        setShouldResetForm(false);
        setTimeout(() => {
          setAlertMessage('');
        }, 1000);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eef2f6' }}>
      {alertMessage && (
        <Alert variant="filled" severity={alertSeverity}>
          {alertMessage}
        </Alert>
      )}
      <div className="form-max-width center-margin">
        {/* <h2>
          REMARK HB LIMITED <br /> <br />
          EMPLOYEE REQUISITION FORM
        </h2> */}
        <Form
          fields={fields}
          initialValues={formData}
          onSubmit={(data) => {
            if (actionType === 'Approved') {
              handleApprovalFormSubmit(data); // Call approval submission handler
            } else {
              handleFormSubmit(data); // Call standard submission handler
            }
          }}
          userList={approvers}
          rowsConfig={[2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1]}
          actionType={actionType || 'sendToApproval'} // Dynamically set actionType
          resetAfterSubmit={shouldResetForm}
          readOnly={actionType === 'Approved'}
        />
      </div>
    </div>
  );
}
