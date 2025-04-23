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

  const tableRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getCandidatesService(); // API endpoint
        if (response.data.statusCode === 200) {
          const data = response.data.data;

          const customColumns = [
            { field: 'candidateNumber', headerName: 'Candidate Number' },
            { field: 'interviewDate', headerName: 'Interview Date', flex: 1 },
            { field: 'fullName', headerName: 'Name', flex: 1 },
            { field: 'status', headerName: 'Status' },
            { field: 'nidNumber', headerName: 'NID' },
            { field: 'email', headerName: 'Email' },
            { field: 'contactNumber', headerName: 'Contact' },
            {
              field: 'action',
              headerName: 'Action',
              sortable: false,
              renderCell: (params) => (
                <div style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                  <button
                    onClick={() => handlePrint(params.row)}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      width: '100%',
                      // background: '#673ab7',
                      // color: 'black',
                      cursor: 'pointer'
                    }}
                  >
                    Print
                  </button>
                </div>
              )
            }
          ];

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

  const handlePrint = async (row) => {
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

        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-10000px';
        iframe.style.left = '-10000px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
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
        `);
        iframeDoc.close();

        // Trigger the print dialog
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        // Clean up the iframe after printing
        iframe.contentWindow.onafterprint = () => {
          document.body.removeChild(iframe);
        };
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
      await updateCandidateStatusService(requestBody, user.token);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      alert(`Error: ${error.message}`);
    } finally {
      const response = await getCandidatesService(); // API endpoint
      if (response.data.statusCode === 200) {
        const data = response.data.data;

        const customColumns = [
          { field: 'candidateNumber', headerName: 'Candidate Number' },
          { field: 'interviewDate', headerName: 'Interview Date', flex: 1 },
          { field: 'fullName', headerName: 'Name', flex: 1 },
          { field: 'status', headerName: 'Status' },
          { field: 'nidNumber', headerName: 'NID' },
          { field: 'email', headerName: 'Email' },
          { field: 'contactNumber', headerName: 'Contact' },
          {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            renderCell: (params) => (
              <div style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
                <button
                  onClick={() => handlePrint(params.row)}
                  style={{
                    padding: '7px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    // background: '#673ab7',
                    // color: 'black',
                    cursor: 'pointer'
                  }}
                >
                  Print
                </button>
              </div>
            )
          }
        ];

        const filteredData = data.map((row) =>
          customColumns.reduce((acc, col) => {
            acc[col.field] = row[col.field];
            return acc;
          }, {})
        );

        setColumns(customColumns);
        setCandidateList(filteredData);
      }
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
