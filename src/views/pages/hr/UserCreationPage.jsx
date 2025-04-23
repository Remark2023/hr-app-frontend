import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { signupProcess } from '../../../utils/SignupProcess';

// styles
import '../../../styles/utils.css';

export default function EvaluationFormPage() {
  const [userCredentials, setUserCredentials] = useState([{ username: '', fullname: '', designation: '', channel: '', password: '' }]);
  const [errors, setErrors] = useState({});

  const headers = [
    { label: 'USERNAME', name: 'username', type: 'text' },
    { label: 'FULL NAME', name: 'fullname', type: 'text' },
    { label: 'DESIGNATION', name: 'designation', type: 'text' },
    { label: 'DEPARTMENT', name: 'channel', type: 'text' },
    { label: 'PASSWORD', name: 'password', type: 'password', minLength: 6 }
  ];

  const validateField = (index, name, value) => {
    const field = headers.find((header) => header.name === name);
    let error = '';

    if (!value.trim()) {
      error = `${field.label} is required.`;
    } else if (field.minLength && value.length < field.minLength) {
      error = `${field.label} must be at least ${field.minLength} characters long.`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${index}-${name}`]: error
    }));
  };

  const handleInputChange = (index, name, value) => {
    const updatedRows = [...userCredentials];
    updatedRows[index][name] = value;
    setUserCredentials(updatedRows);

    // Real-time validation
    validateField(index, name, value);
  };

  const validateAllFields = () => {
    const newErrors = {};

    userCredentials.forEach((credential, index) => {
      headers.forEach((field) => {
        const value = credential[field.name];
        if (!value.trim()) {
          newErrors[`${index}-${field.name}`] = `${field.label} is required.`;
        } else if (field.minLength && value.length < field.minLength) {
          newErrors[`${index}-${field.name}`] = `${field.label} must be at least ${field.minLength} characters long.`;
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRow = () => {
    setUserCredentials([...userCredentials, { username: '', fullname: '', designation: '', channel: '', password: '' }]);
  };

  const handleCloseRow = (index, event) => {
    event.preventDefault();
    const updatedRows = [...userCredentials];
    updatedRows.splice(index, 1);
    setUserCredentials(updatedRows);

    // Remove errors for the deleted row
    const updatedErrors = Object.keys(errors).reduce((acc, key) => {
      if (!key.startsWith(`${index}-`)) {
        acc[key] = errors[key];
      }
      return acc;
    }, {});

    setErrors(updatedErrors);

    // If no rows left, add a default row
    if (updatedRows.length === 0) {
      setUserCredentials([{ username: '', fullname: '', designation: '', channel: '', password: '' }]);
    }
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      alert('Please fix the validation errors before submitting.');
      return;
    }

    const successfulSubmissions = [];
    const failedSubmissions = [];

    for (const lineInfo of userCredentials) {
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
          successfulSubmissions.push(lineInfo);
        } else {
          console.error(signupResponse.alertMessage);
          failedSubmissions.push(lineInfo);
        }
      } catch (error) {
        console.error('Error during submission:', error);
        failedSubmissions.push(lineInfo);
      }
    }

    setUserCredentials(failedSubmissions);

    if (!failedSubmissions.length) {
      alert('All entries submitted successfully!');
      setUserCredentials([{ username: '', fullname: '', designation: '', channel: '', password: '' }]);
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
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginTop: '1rem'
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
    },
    error: { color: 'red', fontSize: '12px', marginTop: '5px' }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eef2f6' }}>
      <div>
        <h2>Please enter the user credentials</h2>

        <button style={responsiveStyles.input} onClick={handleAddRow}>
          <FontAwesomeIcon icon={faPlus} /> Add more
        </button>

        <form style={responsiveStyles.form}>
          <table>
            <thead>
              <tr>
                {headers.map((field, fieldIndex) => (
                  <th key={fieldIndex}>{field.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {userCredentials.map((credential, index) => (
                <tr key={index}>
                  {headers.map((field, fieldIndex) => (
                    <td key={fieldIndex}>
                      <input
                        className="input-field"
                        type={field.type}
                        name={field.name}
                        value={credential[field.name] || ''}
                        onChange={(e) => handleInputChange(index, field.name, e.target.value)}
                        style={responsiveStyles.input}
                      />
                      {errors[`${index}-${field.name}`] && <div style={responsiveStyles.error}>{errors[`${index}-${field.name}`]}</div>}
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
