/* eslint-disable prettier/prettier */
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Portal from '@mui/material/Portal';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { useEffect, useRef, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { getUserData } from '../../../context/UserContext';
import {
  getManpowerRequisitionByApproverService,
  getRequisitionInfoService,
  getUserByUsernameService
} from '../../../services/ApiServices';
import EmployeeRequisitionFormPage from '../EmployeeRequisitionForm';

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
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approver, setApprover] = useState(null);
  const [requisitionInfo, setRequisitionInfo] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserByUsernameService(user.username);
        if (response.data.statusCode === 200) {
          setApprover(response.data.data.id);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(selectedRow);
        const requestBody = { id: selectedRow };
        const response = await getRequisitionInfoService(requestBody, user.token);
        console.log(response);

        if (response.data.statusCode === 200) {
          setRequisitionInfo(response.data.data[0].approvalOf);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }
    fetchData();
  }, [selectedRow]);
  console.log(requisitionInfo);

  useEffect(() => {
    async function fetchData() {
      try {
        if (approver) {
          const requestBody = { id: approver };
          const response = await getManpowerRequisitionByApproverService(user.token, requestBody, 'PENDING');
          if (response.data?.statusCode === 200) {
            const data = response.data.data;
            const approvalList = data.map((item) => item.approvalOf);

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

  const handleRowSelection = (ids) => {
    const selectedID = ids[0];
    console.log(selectedID);
    setSelectedRow(selectedID);
    setDialogOpen(true);
    // const selectedData = approvalList.find((row) => row.id === selectedID);
    // if (selectedData) {
    //   setSelectedRow(selectedData);
    //   setDialogOpen(true);
    // }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <Box id="filter-panel" />
              </Grid>
              <Grid item style={{ width: '100%', overflow: 'auto' }}>
                <div ref={tableRef}>
                  <DataGrid
                    rows={approvalList}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    onRowSelectionModelChange={handleRowSelection}
                    slots={{ toolbar: MyCustomToolbar }}
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

      {/* Dialog for Employee Requisition Form */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullScreen>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px' }}>Employee Requisition Form</DialogTitle>
        <DialogContent>{requisitionInfo && <EmployeeRequisitionFormPage formData={requisitionInfo} actionType="Approved" />}</DialogContent>
      </Dialog>
    </>
  );
}
