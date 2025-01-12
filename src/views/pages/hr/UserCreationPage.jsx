/* eslint-disable no-unused-vars */
import { useState } from 'react';

import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// components
import { signupProcess } from '../../../utils/SignupProcess';

// styles
import '../../../styles/utils.css';

export default function EvaluationFormPage() {
  const [userCredentials, setUserCredentials] = useState([{ username: '', fullname: '', designation: '', channel: '', password: '' }]);

  const headers = [
    { label: 'Username', name: 'username', type: 'text' },
    { label: 'Full Name', name: 'fullname', type: 'text' },
    { label: 'Designation', name: 'designation', type: 'text' },
    { label: 'Channel', name: 'channel', type: 'text' },
    { label: 'Password', name: 'password', type: 'password' }
  ];

  const handleInputChange = (index, name, value) => {
    const updatedRows = [...userCredentials];
    updatedRows[index][name] = value;
    setUserCredentials(updatedRows);
  };

  const handleAddRow = () => {
    setUserCredentials([...userCredentials, { username: '', fullname: '', designation: '', channel: '', password: '' }]);
  };

  const handleCloseRow = (index, event) => {
    event.preventDefault(); // Prevent form submission
    const updatedRows = [...userCredentials];
    updatedRows.splice(index, 1); // Remove the selected row
    setUserCredentials(updatedRows);

    // Check the updatedRows length after deletion
    if (updatedRows.length === 0) {
      setUserCredentials([{ username: '', fullname: '', designation: '', channel: '', password: '' }]); // Add a default row if no rows are left
    }
  };

  const handleSubmit = async () => {
    // Filter out empty rows
    const filteredArray = userCredentials.filter((item) => Object.values(item).some((value) => value.trim() !== ''));

    if (!filteredArray.length) {
      alert('Please submit your experiences!');
      return;
    }

    const successfulSubmissions = [];
    const failedSubmissions = [];

    for (const lineInfo of filteredArray) {
      try {
        const body = {
          username: lineInfo.username,
          password: lineInfo.password,
          status: 'APPROVED',
          fullName: lineInfo.fullname,
          channel: lineInfo.channel,
          designation: lineInfo.designation
        };

        const signupResponse = await signupProcess(body);
        console.log(signupResponse);

        if (signupResponse.alertSeverity === 'success') {
          successfulSubmissions.push(lineInfo); // Track successful submissions
        } else {
          console.error(signupResponse.alertMessage);
          failedSubmissions.push(lineInfo); // Track failed submissions
        }
      } catch (error) {
        console.error('Error during submission:', error);
        failedSubmissions.push(lineInfo); // Track failed submissions
      }
    }

    // Update state with only failed rows
    setUserCredentials(failedSubmissions);

    if (!failedSubmissions.length) {
      alert('All entries submitted successfully!');
      setUserCredentials([{ username: '', fullname: '', designation: '', channel: '', password: '' }]); // Add a default row if no rows are left
    } else {
      alert(`${failedSubmissions.length} entries failed to submit. Please check and try again.`);
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
      <div>
        <h2>Please enter the user credentials</h2>

        <button style={responsiveStyles.input} onClick={handleAddRow} className="margin-bottom-1rem">
          <FontAwesomeIcon icon={faPlus} /> Add more
        </button>

        <form style={responsiveStyles.form}>
          <table className="table table-bordered table-striped table-highlight">
            <thead>
              <tr>
                {headers.map((field, fieldIndex) => (
                  <th key={fieldIndex}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {userCredentials.map((credential, index) => (
                <tr key={index}>
                  {headers.map((field, fieldIndex) => (
                    <td key={fieldIndex}>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={credential[field.name] || ''}
                        onChange={(e) => handleInputChange(index, field.name, e.target.value)}
                        style={{
                          ...responsiveStyles.input
                        }}
                      />
                    </td>
                  ))}
                  <td>
                    <button aria-label="Remove row" onClick={(event) => handleCloseRow(index, event)}>
                      <FontAwesomeIcon icon={faClose} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <button style={responsiveStyles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
