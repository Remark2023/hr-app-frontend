// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://herlan.com/" target="_blank" underline="hover">
      Herlan NY
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://us.remarkhb.com/" target="_blank" underline="hover">
      &copy; Remark HB Limited
    </Typography>
  </Stack>
);

export default AuthFooter;
