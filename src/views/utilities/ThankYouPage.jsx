import { Link } from 'react-router-dom';

// material-ui
import Typography from '@mui/material/Typography';

const ThankYouPage = () => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h3>Thank you for your submission. Wishing you the best of luck on your REMARKABLE journey with us!</h3>
        <Typography
          component={Link}
          to="/candidates/form"
          variant="subtitle1"
          sx={{
            marginTop: '5px',
            textDecoration: 'underline', // Adds underline
            color: 'secondary.main', // Sets text color to blue
            '&:hover': {
              textDecoration: 'none' // Optional: Removes underline on hover
            }
          }}
        >
          click here for another submission
        </Typography>
      </div>
    </>
  );
};

export default ThankYouPage;
