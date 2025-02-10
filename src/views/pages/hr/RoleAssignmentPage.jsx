/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getUserData } from '../../../context/UserContext';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// api services
import { getAllUsersService } from '../../../services/ApiServices';

// styles
import '../../../styles/utils.css';

export default function OtherFacilitiesForm({ candidateNumber }) {
  const user = getUserData();

  const [systemUsers, setSystemUsers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllUsersService();

        if (response.data?.statusCode === 200) {
          setSystemUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  // properties
  const [assignmenList, setAssignmenList] = useState([{ userId: '', roleId: '' }]);

  const headers = [
    { label: 'Select User', name: 'user', type: 'text' },
    { label: 'Select Role', name: 'role', type: 'text' }
  ];

  //   methods
  const handleAddRow = () => {
    setAssignmenList([...assignmenList, { userId: '', roleId: '' }]);
  };

  const handleRoleAssignment = () => {
    console.log(assignmenList);
  };

  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
  };

  const handleSelection = (index, name, selectedOption) => {
    const updatedRows = [...assignmenList];
    updatedRows[index][name] = selectedOption.value;
    setAssignmenList(updatedRows);
  };

  //   user selection
  const userOptions = systemUsers
    .filter((option) => option?.username?.toLowerCase().includes(inputValue?.toLowerCase() || ''))
    .map((option) => ({
      value: option?.id || null,
      label: `${option?.username || ''}`.trim()
    }));

  //   styles
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
    <div>
      <h2>Assign Roles</h2>

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
            </tr>
          </thead>

          <tbody>
            {assignmenList.map((assignment, assignmentIndex) => (
              <tr key={assignmentIndex}>
                <td style={{ width: '50%' }}>
                  <Select
                    name="userId"
                    onChange={(e) => handleSelection(assignmentIndex, 'userId', e)}
                    onInputChange={handleInputChange}
                    options={userOptions}
                    placeholder="Type to select a candidate..."
                    isClearable
                  />
                </td>
                <td>
                  <Select
                    name="roleId"
                    onChange={(e) => handleSelection(assignmentIndex, 'roleId', e)}
                    onInputChange={handleInputChange}
                    options={userOptions}
                    placeholder="Type to select a candidate..."
                    isClearable
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>

      <button style={responsiveStyles.button} onClick={handleRoleAssignment}>
        Submit
      </button>
    </div>
  );
}
