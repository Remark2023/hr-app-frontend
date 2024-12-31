// material-ui
import Grid from '@mui/material/Grid';

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
import CurrentDateCandidates from './CurrentDateCandidates';
import RecentHiredCandidates from './RecentHiredCandidates';

import { gridSpacing } from 'store/constant';

// assets

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <CurrentDateCandidates />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentHiredCandidates />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
