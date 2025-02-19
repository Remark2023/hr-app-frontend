import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { getUserData } from '../../../context/UserContext';

// services
import { getManpowerRequisitionByApproverService, getUserByUsernameService } from '../../../services/ApiServices';

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
  const tableRef = useRef();

  const [approvalList, setApprovalList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [approver, setApprover] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const reponse = await getUserByUsernameService(user.username);

        if (reponse.data.statusCode === 200) {
          setApprover(reponse.data.data.id);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);
  console.log(approver);

  useEffect(() => {
    async function fetchData() {
      try {
        if (approver) {
          const requestBody = {
            id: approver
          };
          const response = await getManpowerRequisitionByApproverService(user.token, requestBody, 'PENDING');

          if (response.data?.statusCode === 200) {
            const data = response.data.data;
            const approvalList = data.map((item) => item.approvalOf);

            // Define your custom columns and map the data to match the headers
            const customColumns = [
              { field: 'id', headerName: 'Serial' },
              { field: 'requiredPosition', headerName: 'Position', flex: 1 },
              { field: 'numberOfEmployee', headerName: 'Vacancy' },
              { field: 'department', headerName: 'Department', flex: 1 },
              { field: 'reasonForRequest', headerName: 'Reason', flex: 1 },
              { field: 'isBudgeted', headerName: 'Budgeted?' },
              { field: 'replacementOf', headerName: 'Replacement Of' },
              { field: 'creationDate', headerName: 'Requisition Date' }
            ];

            // Filter the data to include only the defined columns
            const filteredData = approvalList.map((row) =>
              customColumns.reduce((acc, col) => {
                acc[col.field] = row[col.field];
                return acc;
              }, {})
            );

            setColumns(customColumns);
            setApprovalList(filteredData);
          }
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [approver]);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                {/* <h2>Pending approvals</h2> */}
                <Box id="filter-panel" />
              </Grid>
              <Grid item style={{ width: '100%', overflow: 'auto' }}>
                <div ref={tableRef}>
                  <DataGrid
                    rows={approvalList}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id} // Adjust as per your API's unique identifier
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
          </CardContent>
        </MainCard>
      )}
    </>
  );
}
