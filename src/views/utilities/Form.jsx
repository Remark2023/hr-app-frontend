/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

const Form = ({ fields, initialValues = {}, onFormChange, onSubmit, resetAfterSubmit, rowsConfig }) => {
  const [formValues, setFormValues] = useState(() => {
    const defaultValues = fields.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name] = field.defaultValue;
      }
      return acc;
    }, {});
    return { ...defaultValues, ...initialValues };
  });

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
    <form style={responsiveStyles.form}>
      {groupedFields.map((rowFields, rowIndex) => (
        <div key={rowIndex} style={responsiveStyles.row}>
          {rowFields.map((field, fieldIndex) => (
            <div key={fieldIndex} style={responsiveStyles.field}>
              <label
                style={{
                  ...responsiveStyles.label,
                  display: field.show ? 'none' : 'block'
                }}
              >
                {field.label}
                {field.type === 'checkbox' && (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={formValues[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    style={responsiveStyles.checkbox}
                  />
                )}
              </label>
              {field.type !== 'checkbox' &&
                (field.type === 'select' ? (
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
                ) : field.type === 'textarea' ? ( // Handle textarea
                  <textarea
                    name={field.name}
                    value={formValues[field.name] || ''}
                    placeholder={field.placeholder}
                    readOnly={field.readOnly || false}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    style={{ ...responsiveStyles.input, height: '100px', resize: 'vertical' }} // Additional styles for textarea
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
                ))}
            </div>
          ))}
        </div>
      ))}
      <button style={responsiveStyles.button} onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
};

export default Form;
