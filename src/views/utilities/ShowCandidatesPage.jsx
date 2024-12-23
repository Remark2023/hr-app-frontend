import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';

import { useEffect, useRef, useState } from 'react';
import { getUserData } from '../../context/UserContext';
import InterviewEvaluationForm from '../../reports/InterviewEvaluationForm';
import { getCandidateByNumberService, getCandidatesService, updateCandidateStatusService } from '../../services/ApiServices';

function MyCustomToolbar(props) {
  return (
    <React.Fragment>
      <Portal container={() => document.getElementById('filter-panel')}>
        <GridToolbarQuickFilter />
      </Portal>
      <GridToolbar {...props} />
    </React.Fragment>
  );
}

export default function QuickFilterOutsideOfGrid() {
  const user = getUserData();

  const [candidateList, setCandidateList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref for the table container to print only the table
  const tableRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCandidatesService(); // API endpoint
        if (response.data.statusCode === 200) {
          const data = response.data.data;
          console.log(data);

          // Define your custom columns and map the data to match the headers
          const customColumns = [
            { field: 'candidateNumber', headerName: 'Candidate Number' },
            { field: 'interviewDate', headerName: 'Interview Date', flex: 1 },
            { field: 'fullName', headerName: 'Candidate Name', flex: 1 },
            { field: 'nidNumber', headerName: 'NID Number', flex: 1 },
            { field: 'email', headerName: 'Email' },
            { field: 'contactNumber', headerName: 'Contact Number' },
            {
              field: 'action',
              headerName: 'Action',
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <div style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                  <button
                    onClick={() => updateCandidateStatus(params.row, 'HIRED')}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: 'green',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Hired
                  </button>
                  <button
                    onClick={() => updateCandidateStatus(params.row, 'REJECTED')}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: 'crimson',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => handlePrint(params.row)}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: '#673ab7',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Print
                  </button>
                </div>
              )
            }
          ];

          // Filter the data to include only the defined columns
          const filteredData = data.map((row) =>
            customColumns.reduce((acc, col) => {
              acc[col.field] = row[col.field];
              return acc;
            }, {})
          );

          setColumns(customColumns);
          setCandidateList(filteredData);
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Print function
  const handlePrint = async (row) => {
    console.log('helli');
    if (!row || !row.candidateNumber) {
      console.error('Invalid row data. "candidateNumber" is required.');
      return;
    }

    try {
      const response = await getCandidateByNumberService(row.candidateNumber);

      if (response.data?.statusCode === 200) {
        const printContent = ReactDOMServer.renderToString(<InterviewEvaluationForm candidate={response.data.data} />);

        // Safely extract styles from the current document
        const styles = Array.from(document.styleSheets)
          .map((styleSheet) => {
            try {
              return Array.from(styleSheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n');
            } catch (e) {
              console.warn('Could not access stylesheet:', styleSheet, e);
              return ''; // Skip inaccessible stylesheets (e.g., cross-origin issues)
            }
          })
          .join('\n');

        // Add page-break CSS directly for print
        const pageBreakCSS = `
          @media print {
            .page-break-after {
              page-break-after: always;
            }
            .page-break-before {
              page-break-before: always;
            }
            .page-break-inside {
              page-break-inside: avoid;
            }
          }
        `;

        // Construct the full HTML for the new print window
        const fullHTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Preview</title>
              <style>
                ${styles}
                ${pageBreakCSS}
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `;

        // Open a new window for printing
        const newWindow = window.open('', '_blank', 'width=800,height=600');
        if (newWindow) {
          // Write the full HTML content to the new window
          newWindow.document.open();
          newWindow.document.write(fullHTML);
          newWindow.document.close();

          // Focus the new window and trigger the print dialog
          newWindow.focus();
          newWindow.print();

          // Optionally close the new window after printing
          setTimeout(() => newWindow.close(), 1000);
        } else {
          console.error('Failed to open a new print window. Please check your browser settings.');
        }
      } else {
        console.error('Failed to fetch candidate details. Status code:', response.data?.statusCode);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };

  const updateCandidateStatus = async (row, value) => {
    if (!row || !row.candidateNumber) {
      console.error('Invalid row data. "candidateNumber" is required.');
      return;
    }

    try {
      const requestBody = {
        candidateNumber: row.candidateNumber,
        status: value
      };
      const response = await updateCandidateStatusService(requestBody, user.token);

      const alertMessage = response.data?.statusCode === 200 ? `Successfully ${value}!` : 'Process failed! Try again';
      alert(alertMessage);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Box id="filter-panel" />
      </Grid>
      <Grid item style={{ width: '100%', overflow: 'auto' }}>
        <div ref={tableRef}>
          <DataGrid
            rows={candidateList}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.candidateNumber} // Adjust as per your API's unique identifier
            slots={{
              toolbar: MyCustomToolbar
            }}
            initialState={{
              filter: {
                filterModel: {
                  items: [],
                  quickFilterExcludeHiddenColumns: true
                }
              }
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}
