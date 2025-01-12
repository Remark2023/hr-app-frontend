/* eslint-disable no-unused-vars */
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimateButton from 'ui-component/extended/AnimateButton';
import * as Yup from 'yup';
import { getRoleByTitleService } from '../../../../services/ApiServices';

import { signupProcess } from '../../../../utils/SignupProcess';

const AuthRegister = ({ ...others }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (data) => {
    const roleResponse = await getRoleByTitleService('INTERVIEWER');
    const roleData = roleResponse?.data.data || {};

    const body = {
      username: data.username,
      password: data.password,
      status: 'PENDING',
      roles: [roleData],
      // activeDate: new Date(),
      // inactiveDate: null,
      fullName: data.fullname,
      channel: data.channel,
      designation: data.designation
    };
    const signupResponse = await signupProcess(body);

    setAlertMessage(signupResponse.alertMessage);
    setAlertSeverity(signupResponse.alertSeverity);

    if (signupResponse.redirectToLogin) {
      setTimeout(() => {
        navigate('/pages/login/login3', { replace: true });
      }, 3000);
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        fullname: '',
        designation: '',
        channel: '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('Username is required'),
        fullname: Yup.string().max(255).required('Full name is required'),
        designation: Yup.string().max(255).required('Designation is required'),
        channel: Yup.string().max(255).required('Channel is required'),
        password: Yup.string().max(255).min(6).required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          {alertMessage && (
            <Alert variant="filled" severity={alertSeverity} sx={{ mb: 2 }}>
              {alertMessage}
            </Alert>
          )}

          <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-username-register">Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-username-register"
              type="username"
              value={values.username}
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.username && errors.username && (
              <FormHelperText error id="standard-weight-helper-text--register">
                {errors.username}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.fullname && errors.fullname)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-fullname-register">Full name</InputLabel>
            <OutlinedInput
              id="outlined-adornment-fullname-register"
              type="fullname"
              value={values.fullname}
              name="fullname"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.fullname && errors.fullname && (
              <FormHelperText error id="standard-weight-helper-text--register">
                {errors.fullname}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.designation && errors.designation)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-designation-register">Designation</InputLabel>
            <OutlinedInput
              id="outlined-adornment-designation-register"
              type="designation"
              value={values.designation}
              name="designation"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.designation && errors.designation && (
              <FormHelperText error id="standard-weight-helper-text--register">
                {errors.designation}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.channel && errors.channel)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-channel-register">Channel</InputLabel>
            <OutlinedInput
              id="outlined-adornment-channel-register"
              type="channel"
              value={values.channel}
              name="channel"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.channel && errors.channel && (
              <FormHelperText error id="standard-weight-helper-text--register">
                {errors.channel}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-register"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              label="Password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-register">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                Sign up
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthRegister;
