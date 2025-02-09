/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

const Form = ({ fields, initialValues = {}, onFormChange, onSubmit, resetAfterSubmit, rowsConfig, actionType, userList }) => {
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
    const [selectedUser, setSelectedUser] = useState(''); // State for selected user in the dropdown

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
        onSubmit(formValues); // Submit all form data
        if (resetAfterSubmit) setFormValues(initializeFormValues()); // Reset form after submit
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleFinish = async () => {
        const formDataWithUser = {
            ...formValues,
            selectedUser: selectedUser
        };
        try {
            await onSubmit(formDataWithUser);
            setIsModalOpen(false);
            if (resetAfterSubmit) {
                setFormValues({});
            }

            // Show success alert if data is saved
            alert('Data Saved Successfully');
            setAlertMessage('Data Saved Successfully');
            setAlertSeverity('success');
            setTimeout(() => {
                setAlertMessage('');
            }, 3000);
        } catch (error) {
            alert('Process failed! Please try again...');
            setAlertMessage('Process failed! Please try again...');
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
        },
        modal: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            zIndex: 1000,
            width: '400px'
        },
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
        },
        select: {
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px',
            width: 'calc(100% - 120px)' // Adjust width to accommodate the button
        },
        finishButton: {
            padding: '10px 20px',
            backgroundColor: '#5b2c6f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
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

    return (
        <>
            <form style={responsiveStyles.form}>
                {groupedFields.map((rowFields, rowIndex) => (
                    <div key={rowIndex} style={responsiveStyles.row}>
                        {rowFields.map((field, fieldIndex) => (
                            <div key={fieldIndex} style={responsiveStyles.field}>
                                {/* Handling Checkboxes (Single & Multiple Options) */}
                                {field.type === 'checkbox' && field.options ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ fontWeight: 'bold', fontSize: '14px' }}>{field.label}</label>
                                        {field.options.map((option, idx) => (
                                            <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <input
                                                    type="checkbox"
                                                    name={field.name}
                                                    value={option.value}
                                                    checked={formValues[field.name]?.includes(option.value) || false}
                                                    onChange={(e) => {
                                                        const updatedValues = formValues[field.name] || [];
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
                                                readOnly={field.readOnly || false}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                style={{ ...responsiveStyles.input, height: '100px', resize: 'vertical' }}
                                            />
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formValues[field.name] || ''}
                                                placeholder={field.placeholder}
                                                readOnly={field.readOnly || false}
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
                ) : (
                    <button style={responsiveStyles.button} onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </form>
            {isModalOpen && (
                <>
                    <div style={responsiveStyles.modalOverlay} onClick={() => setIsModalOpen(false)} />
                    <div style={responsiveStyles.modal}>
                        <h3>Select an Approver</h3>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select style={responsiveStyles.select} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                <option value="">Select an Approver</option>
                                {userList.map((user, idx) => (
                                    <option key={idx} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                            <button style={responsiveStyles.finishButton} onClick={handleFinish}>
                                Finish
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Form;
