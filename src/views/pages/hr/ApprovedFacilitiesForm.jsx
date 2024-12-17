/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { getUserData } from '../../../context/UserContext';
import Form from '../../utilities/Form';

// api services
import { addCandidateFacilitiesInfoService, getCandidateFacilitiesByCandidateInfoService } from '../../../services/ApiServices';

export default function ExpectedStatusForm({ candidateNumber }) {
  const user = getUserData();
  const [formData, setFormData] = useState({
    facilityType: 'APPROVED',
    company: '',
    sbu: '',
    department: '',
    jobGrade: '',
    reportsTo: '',
    jobLocation: '',
    designation: '',
    salary: null,
    bonus: '',
    taOrConveyance: '',
    daOrFood: '',
    benefitOrAllowance: '',
    pfOrGratuity: '',
    transportFacility: '',
    incentiveOrKpi: '',
    mobileCeiling: '',
    totalCtc: ''
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const requestBody = {
          candidateNumber: candidateNumber
        };

        const response = await getCandidateFacilitiesByCandidateInfoService(requestBody, 'APPROVED');
        if (response.data?.statusCode === 200) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [candidateNumber]);

  const handleFormChange = async (data) => {
    console.log(data);
  };

  const handleSubmit = async (data) => {
    try {
      const requestBody = {
        ...data,
        candidate: {
          candidateNumber: candidateNumber
        }
      };
      const response = await addCandidateFacilitiesInfoService(requestBody, user.token);

      if (response.data?.statusCode === 200) {
        alert('Data Saved Successfully');
      } else {
        alert('Process failed! Try again');
      }
    } catch (error) {
      alert('An error occurred! Please try again.');
    }
  };

  const fields = [
    { label: 'Company', name: 'company', type: 'text' },
    { label: 'SBU', name: 'sbu', type: 'text' },
    { label: 'Department', name: 'department', type: 'text' },
    { label: 'Reports to', name: 'reportsTo', type: 'text' },
    { label: 'Designation', name: 'designation', type: 'text' },
    { label: 'Salary', name: 'salary', type: 'number' },
    { label: 'Bonus', name: 'bonus', type: 'text' },
    { label: 'TA/Conveyance', name: 'taOrConveyance', type: 'text' },
    { label: 'DA/Food', name: 'daOrFood', type: 'text' },
    {
      label: 'Benefit/Allowance',
      name: 'benefitOrAllowance',
      type: 'text'
    },
    { label: 'PF/Gratuity', name: 'pfOrGratuity', type: 'text' },
    { label: 'Transport Facility', name: 'transportFacility', type: 'text' },
    { label: 'Incentive/Kpi', name: 'incentiveOrKpi', type: 'text' },
    { label: 'Mobile Ceiling', name: 'mobileCeiling', type: 'text' },
    { label: 'Total Ctc', name: 'totalCtc', type: 'text' }
  ];

  return (
    <div>
      <Form
        fields={fields}
        initialValues={formData} // Pass the form data, including calculated fields
        rowsConfig={[3, 3, 3, 3, 3]}
        onFormChange={handleFormChange} // Update calculations when inputs change
        onSubmit={handleSubmit} // Handle final submission
        resetAfterSubmit={true}
      />
    </div>
  );
}
