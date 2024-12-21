/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { getUserData } from '../../../context/UserContext';
import Form from '../../utilities/Form';

// api services
import { getCandidateByNumberService, updateCandidateInfoService } from '../../../services/ApiServices';

export default function OtherFacilitiesForm({ candidateNumber }) {
  const user = getUserData();
  const [formData, setFormData] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCandidateByNumberService(candidateNumber);

        if (response.data?.statusCode === 200) {
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [candidateNumber]);
  console.log(formData);

  const handleFormChange = async (data) => {
    console.log(data);
  };

  const handleSubmit = async (data) => {
    if (!data.candidateNumber) {
      alert('Please select a candidate!');
      return;
    }

    try {
      const response = await updateCandidateInfoService(data, user.token);

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
    { label: 'Notice Period', name: 'noticePeriods', type: 'text', placeholder: 'Enter Notice Period' },
    { label: 'DOJ', name: 'doj', type: 'text', placeholder: 'Enter DOJ' },
    { label: 'Probation Period', name: 'probationPeriod', type: 'text', placeholder: 'Enter Prob. Period' },
    { label: 'Investigation', name: 'investigation', type: 'text', placeholder: 'Enter Investigation' },
    { label: 'HR Note(if any) :', name: 'hrNotes', type: 'textarea', placeholder: 'Enter HR Note' },
    {
      label: 'Management Comments :',
      name: 'managementComment',
      type: 'textarea',
      placeholder: 'Enter Management Comments '
    }
  ];

  return (
    <div>
      <Form
        fields={fields}
        initialValues={formData}
        rowsConfig={[4, 1, 1]}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        resetAfterSubmit={true}
      />
    </div>
  );
}
