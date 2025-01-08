import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import * as React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';
import { getUserData } from '../../../context/UserContext';
import { getUsersByStatusService, updateSignupStatusService } from '../../../services/ApiServices';

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

export default function CurrentDateCandidates() {
  const user = getUserData();

  const [userList, setUserList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for the table container to print only the table
  const tableRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUsersByStatusService('PENDING');

        if (response.data?.statusCode === 200) {
          const data = response.data.data;
          const customColumns = [
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'username', headerName: 'Username', flex: 1 },
            {
              field: 'action',
              headerName: 'Action',
              sortable: false,
              flex: 1,
              renderCell: (params) => (
                <div>
                  <button
                    onClick={() => updateStatus(params.row)}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: '#0d6efd',
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </button>
                  {/* <button
                    onClick={() => updateStatus(params.row, 'REJECTED')}
                    style={{
                      padding: '7px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      background: params.row.status === 'REJECTED' ? '#dc3545' : '',
                      // color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Rejected
                  </button> */}
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
          setUserList(filteredData);
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateStatus = async (row) => {
    if (!row || !row.id) {
      console.error('Invalid row data. "userid" is required.');
      return;
    }

    try {
      const requestBody = {
        id: row.id,
        status: 'APPROVED'
      };
      const response = await updateSignupStatusService(requestBody, user.token);

      if (response.data.statusCode !== 200) {
        alert(`error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      alert(`Error: ${error.message}`);
    } finally {
      const response = await getUsersByStatusService('PENDING');

      if (response.data.statusCode === 200) {
        const data = response.data.data;

        const customColumns = [
          { field: 'id', headerName: 'ID', flex: 1 },
          { field: 'username', headerName: 'Username', flex: 1 },
          {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <div>
                <button
                  onClick={() => updateStatus(params.row)}
                  style={{
                    padding: '7px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    background: '#0d6efd',
                    cursor: 'pointer'
                  }}
                >
                  Approve
                </button>
                {/* <button
                  onClick={() => updateStatus(params.row, 'REJECTED')}
                  style={{
                    padding: '7px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    background: params.row.status === 'REJECTED' ? '#dc3545' : '',
                    // color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Rejected
                </button> */}
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
        setUserList(filteredData);
      }

      if (response.data.statusCode === 404) {
        setUserList([]);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            {userList.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  No pending signup for approval.
                </Typography>
              </Grid>
            ) : (
              <Grid container spacing={2} style={{ backgroundColor: 'white' }}>
                <Grid item mb={1}>
                  <Typography variant="h4">Signup Approval</Typography>
                </Grid>
                <Grid item style={{ width: '100%', overflow: 'auto' }}>
                  <div ref={tableRef}>
                    <DataGrid
                      rows={userList}
                      columns={columns}
                      loading={loading}
                      getRowId={(row) => row.id}
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
            )}
          </CardContent>
        </MainCard>
      )}
    </>
  );
}
