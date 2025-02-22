/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

const Form = ({ fields, initialValues = {}, onFormChange, onSubmit, resetAfterSubmit, rowsConfig, actionType, userList, readOnly }) => {
  const initializeFormValues = () => {
    return fields.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {});
  };
  const [alertMessage, setAlertMessage] = useState('');
  const [formValues, setFormValues] = useState(() => {
    const defaultValues = fields.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {});
    return { ...defaultValues, ...initialValues };
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State for managing modal visibility
  const [isModalOpenForApproval, setIsModalOpenForApproval] = useState(false);
  const [isModalOpenForReject, setIsModalOpenForReject] = useState(false);
  const [selectedUser, setSelectedUser] = useState(''); // State for selected user in the dropdown
  const [isApproved, setIsApproved] = useState(false);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    // Sync state with updated initialValues if they change
    setFormValues((prevValues) => ({
      ...prevValues,
      ...initialValues
    }));
  }, [initialValues]);

  const handleChange = (name, value) => {
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);
    if (onFormChange) onFormChange(updatedValues); // Notify parent of changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);

    onSubmit(formValues); // Submit all form data
    if (resetAfterSubmit) setFormValues(initializeFormValues()); // Reset form after submit
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleApprovalFormSubmit = (e, action) => {
    e.preventDefault();

    if (action === 'send') {
      setIsModalOpenForApproval(true);
    } else if (action === 'cancel') {
      setIsModalOpenForReject(true);
    }
  };

  const handleApprovalFormSubmitFinish = (e) => {
    e.preventDefault();
    const updatedFormValues = {
      ...formValues,
      selectedUser: selectedUser,
      isApproved: isApproved,
      remarks: remarks

      // ...approvedData,
      // isFinished: isFinished, // Add approvedBy fields to formValues
    };

    try {
      onSubmit(updatedFormValues);
      // setIsModalOpenForApproval(false);
      if (resetAfterSubmit) {
        setFormValues(initializeFormValues());
      }
    } catch (error) {
      // alert('Process failed! Please try again...');
      setAlertSeverity('error');
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }
  };

  const handleApprovalFormSubmitReject = (e) => {
    e.preventDefault();

    // Ensure we are correctly setting isApproved to 'Reject'
    const updatedFormValues = {
      ...formValues, // Preserve existing form values
      selectedUser: selectedUser, // Ensure selectedUser is passed
      isApproved: 'Reject', // Explicitly set isApproved
      remarks: remarks || '' // Ensure remarks is defined to avoid issues
    };

    try {
      onSubmit(updatedFormValues); // Submit the updated form data

      // Reset form if required
      if (resetAfterSubmit) {
        setFormValues(initializeFormValues());
      }
    } catch (error) {
      console.error('Submission error:', error);
      setAlertSeverity('error');
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    const formDataWithUser = {
      ...formValues,
      selectedUser: selectedUser
    };
    console.log(formDataWithUser);

    try {
      onSubmit(formDataWithUser);
      setIsModalOpen(false);
      if (resetAfterSubmit) {
        setFormValues(initializeFormValues());
      }
    } catch (error) {
      // alert('Process failed! Please try again...');
      setAlertSeverity('error');
      setTimeout(() => {
        setAlertMessage('');
      }, 3000);
    }
  };

  const responsiveStyles = {
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%',
      maxWidth: '1200px',
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
    },
    modalOverlay: {
      position: 'fixed', // Keeps the overlay fixed in place
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
      zIndex: 999 // Ensures the overlay is above all other elements
    },
    modal: {
      position: 'fixed', // Ensure the modal stays fixed
      top: '50%', // Center it vertically
      left: '50%', // Center it horizontally
      transform: 'translate(-50%, -50%)', // Adjust for exact centering
      backgroundColor: '#fff',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      zIndex: 1000, // Modal should be above the overlay
      width: '400px', // Set a fixed width for the modal
      maxWidth: '90%' // Ensure it doesn't go beyond the screen width
    },
    select: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '10px',
      width: 'calc(100% - 120px)' // Adjust width to accommodate the button
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'row',
      gap: '10px', // Space between elements
      justifyContent: 'flex-start',
      width: '100%', // Ensure it takes full width
      flexWrap: 'nowrap' // Keep everything in one line
    },
    approveButton: {
      padding: '10px 20px',
      backgroundColor: '#28a745', // Green for approval
      width: '100%',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    finishButton: {
      padding: '10px 20px',
      backgroundColor: '#5b2c6f', // Purple for finish
      width: '100%',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '14px',
      cursor: 'pointer'
    }
  };

  const groupFieldsByRows = (fields, rowsConfig) => {
    const groupedRows = [];
    let index = 0;

    rowsConfig.forEach((rowSize) => {
      const row = fields.slice(index, index + rowSize);
      groupedRows.push(row);
      index += rowSize;
    });

    if (index < fields.length) {
      groupedRows.push(fields.slice(index));
    }

    return groupedRows;
  };

  const groupedFields = groupFieldsByRows(fields, rowsConfig || [fields.length]);

  const approvedData = [
    { header: 'Approved By', value: 'John Doe' },
    { header: 'Reviewed By', value: 'Jane Smith' },
    { header: 'Checked By', value: 'Michael Johnson' },
    { header: 'Authorized By', value: '' },
    { header: 'Finalized By', value: '' }
  ];

  return (
    <>
      <form style={responsiveStyles.form}>
        {groupedFields.map((rowFields, rowIndex) => (
          <div key={rowIndex} style={responsiveStyles.row}>
            {rowFields.map((field, fieldIndex) => (
              <div key={fieldIndex} style={responsiveStyles.field}>
                {/* Handling Checkboxes (Single & Multiple Options) */}
                {field.type === 'checkbox' && field.options ? (
                  <div style={{ textAlign: 'start' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>{field.label}</label>
                    {field.options.map((option, idx) => (
                      <label key={idx} style={{ display: 'flex', gap: '5px' }}>
                        <input
                          type="checkbox"
                          name={field.name}
                          value={option.value}
                          checked={(formValues[field.name] ?? []).includes(option.value)}
                          onChange={(e) => {
                            const updatedValues = formValues[field.name] ?? [];
                            const newValue = e.target.value;
                            const newCheckedState = e.target.checked;

                            handleChange(
                              field.name,
                              newCheckedState
                                ? [...updatedValues, newValue] // Add selected value
                                : updatedValues.filter((val) => val !== newValue) // Remove unselected value
                            );
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                ) : field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formValues[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    style={responsiveStyles.checkbox}
                  />
                ) : (
                  <>
                    <label
                      style={{
                        ...responsiveStyles.label,
                        display: field.show ? 'none' : 'block'
                      }}
                    >
                      {field.label}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        style={{
                          ...responsiveStyles.input,
                          display: field.show ? 'none' : 'block'
                        }}
                      >
                        {field.options.map((option, idx) => (
                          <option key={idx} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formValues[field.name] || ''}
                        placeholder={field.placeholder}
                        readOnly={readOnly}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        style={{ ...responsiveStyles.input, height: '100px', resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        placeholder={field.placeholder}
                        readOnly={readOnly}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        style={{
                          ...responsiveStyles.input,
                          display: field.show ? 'none' : 'block'
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        {actionType === 'sendToApproval' ? (
          <button style={responsiveStyles.button} onClick={handleFormSubmit}>
            Send to Approval
          </button>
        ) : actionType === 'Approved' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={responsiveStyles.button} onClick={(e) => handleApprovalFormSubmit(e, 'send')}>
              Send
            </button>
            <button style={responsiveStyles.button} onClick={(e) => handleApprovalFormSubmit(e, 'cancel')}>
              Finish
            </button>
          </div>
        ) : (
          <button style={responsiveStyles.button} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </form>
      {isModalOpen && (
        <>
          <div
            style={{
              position: 'fixed', // Fix overlay in place
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark overlay
              zIndex: 999 // Ensure it's on top
            }}
            onClick={() => setIsModalOpen(false)} // Close modal when clicking overlay
          />
          <div
            style={{
              position: 'fixed', // Fix modal in place
              top: '50%', // Move modal vertically to the center
              left: '50%', // Move modal horizontally to the center
              transform: 'translate(-50%, -50%)', // Adjust the modal's center point
              width: '50%', // Set modal width (50% of screen width)
              height: '50%', // Set modal height (50% of screen height)
              backgroundColor: '#fff', // White background for the modal
              padding: '20px',
              boxSizing: 'border-box',
              zIndex: 1000, // Make sure modal is above the overlay
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h3>Select an Approver</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                style={{
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '300px'
                }}
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select an Approver</option>
                {userList.map((user, idx) => (
                  <option key={idx} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
              <button
                style={{
                  padding: '15px',
                  backgroundColor: '#5b2c6f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
                onClick={handleFinish}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
      {isModalOpenForApproval && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 999
            }}
            onClick={() => setIsModalOpenForApproval(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              height: '50%', // Fixed height
              backgroundColor: '#fff',
              padding: '20px',
              boxSizing: 'border-box',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Yes/No Checkboxes */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label>Finish:</label>
              <label>
                <input type="checkbox" checked={isApproved === 'yes'} onChange={() => setIsApproved('yes')} />
                Yes
              </label>
              <label>
                <input type="checkbox" checked={isApproved === 'no'} onChange={() => setIsApproved('no')} />
                No
              </label>
            </div>

            {/* Show Select User if No is selected */}
            {isApproved === 'no' && (
              <div style={{ marginTop: '10px' }}>
                <label>Select an Approver</label>
                <select
                  style={{
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '300px'
                  }}
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select an Approver</option>
                  {userList.map((user, idx) => (
                    <option key={idx} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Remarks Field */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', width: '50%' }}>
              <label>Remarks</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#5b2c6f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={handleApprovalFormSubmitFinish}
            >
              Submit
            </button>
          </div>
        </>
      )}

      {isModalOpenForReject && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 999
            }}
            onClick={() => setIsModalOpenForReject(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              height: '50%', // Fixed height
              backgroundColor: '#fff',
              padding: '20px',
              boxSizing: 'border-box',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Remarks Field */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', width: '50%' }}>
              <label>Remarks</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#5b2c6f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={handleApprovalFormSubmitReject}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Form;
