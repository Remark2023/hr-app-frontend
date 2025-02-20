// @mui
import { Box, CardContent, Grid, Portal, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarQuickFilter } from '@mui/x-data-grid';

import PropTypes from 'prop-types';
import * as React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

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

export default function DatatableWithToolbarComponent({ loading, isLoading, columns, contents, notFoundText }) {
  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            {contents.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  {notFoundText}
                </Typography>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item>
                  <Box id="filter-panel" />
                </Grid>
                <Grid item sx={{ width: '100%', overflow: 'auto' }}>
                  <DataGrid
                    rows={contents}
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
                </Grid>
              </Grid>
            )}
          </CardContent>
        </MainCard>
      )}
    </>
  );
}

DatatableWithToolbarComponent.propTypes = {
  loading: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  columns: PropTypes.array,
  contents: PropTypes.array,
  notFoundText: PropTypes.string
};
