import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { DataGrid, GridToolbarDensitySelector } from '@mui/x-data-grid';
import * as React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import Typography from '@mui/material/Typography';

import { useEffect, useRef, useState } from 'react';
import { getCandidatesByDateService } from '../../services/ApiServices';

function MyCustomToolbar(props) {
  const customProps = {
    ...props,
    showQuickFilter: false
  };

  return (
    <React.Fragment>
      <div style={{ padding: 8, display: 'none', alignItems: 'center' }}>
        <GridToolbarDensitySelector {...props} />
      </div>
    </React.Fragment>
  );
}

export default function CurrentDateCandidates() {
  const [candidateList, setCandidateList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for the table container to print only the table
  const tableRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const response = await getCandidatesByDateService(currentDate);
        console.log(response);

        if (response.data?.statusCode === 200) {
          const data = response.data.data;

          // Define your custom columns and map the data to match the headers
          const customColumns = [
            { field: 'candidateNumber', headerName: 'Number' },
            { field: 'fullName', headerName: 'Name', flex: 1 },
            { field: 'nidNumber', headerName: 'NID', flex: 1 },
            { field: 'email', headerName: 'Email', flex: 1 },
            { field: 'contactNumber', headerName: 'Contact Number', flex: 1 }
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
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            {candidateList.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  No Interviewee available for today.
                </Typography>
              </Grid>
            ) : (
              <Grid container spacing={2} style={{ backgroundColor: 'white' }}>
                <Grid item mb={1}>
                  <Typography variant="h4">Today's Interviewees</Typography>
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
                      density="compact"
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
