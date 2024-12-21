/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUserData } from '../../context/UserContext';
import Form from '../utilities/Form';

// api services
import { addEvaluationForm, getCandidatesByDateService, getCandidatesService } from '../../services/ApiServices';

export default function EvaluationFormPage() {
  const user = getUserData();
  const [formData, setFormData] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [candidateList, setCandidateList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [shouldResetForm, setShouldResetForm] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedDate) {
          const reponse = await getCandidatesByDateService(selectedDate);
          if (reponse.data.statusCode === 200) {
            setCandidateList(reponse.data.data);
          }
        } else {
          const reponse = await getCandidatesService(selectedDate);
          if (reponse.data.statusCode === 200) {
            setCandidateList(reponse.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, [selectedDate]);
  console.log(candidateList);

  // Calculate derived fields when form data changes
  const calculateDerivedFields = (data) => {
    const fieldsToSum = ['attireBodyLanguage', 'workKnowledge', 'teamPlayer', 'problemSolvingSkill', 'communicationSkill'];
    const totalMarks = fieldsToSum.reduce((total, field) => total + (parseFloat(data[field]) || 0), 0);
    const performance =
      totalMarks >= 45 ? 'Outstanding' : totalMarks >= 31 ? 'Good' : totalMarks >= 23 ? 'Average' : totalMarks >= 17 ? 'Fair' : 'Poor';

    return {
      ...data,
      totalMarks: totalMarks,
      avgMarks: totalMarks / fieldsToSum.length,
      performance
    };
  };

  const handleFormChange = (data) => {
    const updatedData = calculateDerivedFields(data); // Calculate derived fields
    setFormData(updatedData); // Update state with new data
  };

  const handleSubmit = async (data) => {
    if (selectedCandidate) {
      try {
        const requestBody = {
          attireBodyLanguage: data.attireBodyLanguage,
          workKnowledge: data.workKnowledge,
          teamPlayer: data.teamPlayer,
          problemSolvingSkill: data.problemSolvingSkill,
          communicationSkill: data.communicationSkill,
          outOfMarks: data.outOfMarks,
          totalMarks: data.totalMarks,
          avgMarks: data.avgMarks,
          performance: data.performance,
          candidate: {
            candidateNumber: selectedCandidate
          }
        };

        const response = await addEvaluationForm(requestBody, user.token);
        if (response.data.statusCode === 200) {
          setAlertMessage('Data Saved Successfully');
          setAlertSeverity('success');
          setShouldResetForm(true);
          setTimeout(() => {
            setAlertMessage('');
          }, 1000);
        } else {
          setAlertMessage('Process failed! Try again');
          setAlertSeverity('error');
          setShouldResetForm(false);
          setTimeout(() => {
            setAlertMessage('');
          }, 1000);
        }
      } catch (error) {
        setAlertMessage('An Error Occured! Please Try Again..');
        setAlertSeverity('error');
        setShouldResetForm(false);
        setTimeout(() => {
          setAlertMessage('');
        }, 1000);
      }
    } else {
      alert('Please select a candidaete');
    }
  };

  const fields = [
    { label: 'Out of Marks', name: 'outOfMarks', type: 'number', placeholder: 'Out of Marks', defaultValue: 10 },
    { label: 'Average Marks', name: 'avgMarks', type: 'number', placeholder: 'Average Marks', readOnly: true },
    { label: 'Performance', name: 'performance', type: 'text', placeholder: 'Enter Performance', readOnly: true },

    { label: 'Attire Body Language', name: 'attireBodyLanguage', type: 'number', placeholder: 'Attire Body Language' },
    { label: 'Work Knowledge', name: 'workKnowledge', type: 'number', placeholder: 'Enter Work Knowledge' },
    { label: 'Team Player', name: 'teamPlayer', type: 'number', placeholder: 'Team Player' },
    { label: 'Problem Solving Skill', name: 'problemSolvingSkill', type: 'number', placeholder: 'Problem Solving Skill' },
    { label: 'Communication Skill', name: 'communicationSkill', type: 'number', placeholder: 'Communication Skill' },
    { label: 'Total Marks', name: 'totalMarks', type: 'number', placeholder: 'Total Marks', readOnly: true }
  ];

  const handleDateChange = (data) => {
    setSelectedDate(data);
  };

  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const candidateOptions = candidateList
    .filter((option) => option?.status == null && option?.fullName?.toLowerCase().includes(inputValue?.toLowerCase() || ''))
    .map((option) => ({
      value: option?.candidateNumber || null,
      label: `${option?.fullName || ''} (${option?.nidNumber || ''})`.trim()
    }));

  const handleCandidateSelection = (selectedOption) => {
    setSelectedCandidate(selectedOption.value);
  };

  return (
    <div>
      {alertMessage && (
        <Alert variant="filled" severity={alertSeverity}>
          {alertMessage}
        </Alert>
      )}
      <div
        style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '1rem'
        }}
      >
        <div
          style={{
            flex: '1 1 calc(20% - 12px)',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box'
          }}
        >
          <label style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'left' }}>Select interview date</label>
          <input
            type="date"
            name="interviewDate"
            onChange={(e) => handleDateChange(e.target.value)}
            style={{ padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <div
          style={{
            flex: '1 1 calc(20% - 12px)',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxSizing: 'border-box'
          }}
        >
          <label style={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'left' }}>Select candidate</label>
          <Select
            name="candidate"
            onChange={handleCandidateSelection}
            onInputChange={handleInputChange}
            options={candidateOptions}
            placeholder="Type to select a candidate..."
            isClearable
            style={{ padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <Form
        fields={fields}
        initialValues={formData} // Pass the form data, including calculated fields
        rowsConfig={[3, 3, 3]}
        onFormChange={handleFormChange} // Update calculations when inputs change
        onSubmit={handleSubmit} // Handle final submission
        resetAfterSubmit={shouldResetForm}
      />
    </div>
  );
}
