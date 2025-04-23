/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUserData } from '../../context/UserContext';

// api services
import { addEvaluationForm, getCandidatesByDateService, getCandidatesService } from '../../services/ApiServices';

// css
import '../../styles/candidate-evaluation-form.css';
import '../../styles/utils.css';

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

  const positionOptions = [
    { value: 'EXECUTIVE', label: 'EXECUTIVE' },
    { value: 'SENIOR EXECUTIVE', label: 'SENIOR EXECUTIVE' }
  ];

  const departmentOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'SALES', label: 'SALES' },
    { value: 'HR', label: 'HR' }
  ];

  const customStylesSelect = {
    control: (provided, state) => ({
      ...provided,
      borderColor: '#ccc', // your custom border
      boxShadow: 'none', // remove blue glow
      '&:hover': {
        borderColor: '#ccc' // on hover
      }
    }),
    // Optional: remove blue border on focus too
    menu: (provided) => ({
      ...provided,
      zIndex: 9999 // helpful if used in modals/forms
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#eef2f6' // when selected
        : state.isFocused
          ? '#eef2f6' // when hovered
          : '#f9f9f9', // default background
      color: '#000',
      cursor: 'pointer'
    })
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
        <div className="input-div">
          <label className="input-label">Select interview date</label>
          <input type="date" name="interviewDate" onChange={(e) => handleDateChange(e.target.value)} className="input-field" />
        </div>

        <div className="input-div">
          <label className="input-label">Select candidate</label>
          <Select
            className="input-field-dropdown"
            name="candidate"
            onChange={handleCandidateSelection}
            onInputChange={handleInputChange}
            options={candidateOptions}
            placeholder="Type to select a candidate..."
            isClearable
            styles={customStylesSelect}
          />
        </div>
      </div>
      {/* <Form
        fields={fields}
        initialValues={formData} // Pass the form data, including calculated fields
        rowsConfig={[3, 3, 3]}
        onFormChange={handleFormChange} // Update calculations when inputs change
        onSubmit={handleSubmit} // Handle final submission
        resetAfterSubmit={shouldResetForm}
      /> */}
      <div className="container">
        <div className="info">
          <div className="input-div">
            <label className="input-label">INTERVIEW POSITION</label>
            <Select
              name="candidate"
              className="input-field-dropdown"
              onChange={handleCandidateSelection}
              onInputChange={handleInputChange}
              options={positionOptions}
              placeholder="Type to select a candidate..."
              isClearable
            />
          </div>
          <div className="input-div">
            <label className="input-label">INTERVIEW DEPARTMENT</label>
            <Select
              className="input-field-dropdown"
              name="candidate"
              onChange={handleCandidateSelection}
              onInputChange={handleInputChange}
              options={departmentOptions}
              placeholder="Type to select a candidate..."
              isClearable
            />
          </div>
        </div>

        <div className="info">
          <div className="input-div">
            <label className="input-label">CURRENT SALARY</label>
            <input
              type="text"
              name="currentSalary"
              // value={formValues[field.name] || ''}
              // placeholder={field.placeholder}
              // readOnly={true}
              // onChange={(e) => handleChange(field.name, e.target.value)}
              // style={{
              //   ...responsiveStyles.input,
              //   display: field.show ? 'none' : 'block'
              // }}
              className="input-field"
            />
          </div>
          <div className="input-div">
            <label className="input-label">CURRENT DESIGNATION</label>
            <input
              type="text"
              name="currentSalary"
              // value={formValues[field.name] || ''}
              // placeholder={field.placeholder}
              // readOnly={readOnly}
              // onChange={(e) => handleChange(field.name, e.target.value)}
              // style={{
              //   ...responsiveStyles.input,
              //   display: field.show ? 'none' : 'block'
              // }}
              className="input-field"
            />
          </div>
          <div className="input-div">
            <label className="input-label">TOTAL YEARS OF EXPERIENCES</label>
            <input
              type="text"
              name="currentSalary"
              // value={formValues[field.name] || ''}
              // placeholder={field.placeholder}
              // readOnly={readOnly}
              // onChange={(e) => handleChange(field.name, e.target.value)}
              // style={{
              //   ...responsiveStyles.input,
              //   display: field.show ? 'none' : 'block'
              // }}
              className="input-field"
            />
          </div>
        </div>

        <div className="info">
          <div className="input-div">
            <label className="input-label">EXPECTED SALARY</label>
            <input
              type="text"
              name="currentSalary"
              // value={formValues[field.name] || ''}
              // placeholder={field.placeholder}
              // readOnly={readOnly}
              // onChange={(e) => handleChange(field.name, e.target.value)}
              // style={{
              //   ...responsiveStyles.input,
              //   display: field.show ? 'none' : 'block'
              // }}
              className="input-field"
            />
          </div>
          <div className="input-div">
            <label className="input-label">NEGOTIATED SALARY</label>
            <input
              type="text"
              name="currentSalary"
              // value={formValues[field.name] || ''}
              // placeholder={field.placeholder}
              // readOnly={readOnly}
              // onChange={(e) => handleChange(field.name, e.target.value)}
              // style={{
              //   ...responsiveStyles.input,
              //   display: field.show ? 'none' : 'block'
              // }}
              className="input-field"
            />
          </div>
        </div>

        <hr style={{ margin: '2rem' }} />

        <h3>EVALUATION</h3>
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>
                Excellent
                <br />
                (5)
              </th>
              <th>
                Good
                <br />
                (4)
              </th>
              <th>
                Average
                <br />
                (3)
              </th>
              <th>
                Below Average
                <br />
                (2)
              </th>
              <th>
                Poor
                <br />
                (1)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Appearance (Grooming, Body language)</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Interpersonal Skills / Outspoken</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Leadership Competencies</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Positive Mindset</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Necessary Knowledge for This Position</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Poor Fair Average Good Superior</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Interview Q/A Assesment</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>Communication Skills</td>
              {[5, 4, 3, 2, 1].map((score) => (
                <td key={score}>
                  <input type="checkbox" name="appearance" value={score} />
                </td>
              ))}
            </tr>

            <tr>
              <td>
                <strong>Total score:</strong>
              </td>
              <td colSpan={5} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
