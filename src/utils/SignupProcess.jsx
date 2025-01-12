import { addEmployeeService, getRoleByTitleService, getUserByUsernameService, signUpForm } from '../services/ApiServices';

export const signupProcess = async (data) => {
  const returnValue = {
    alertSeverity: '',
    alertMessage: '',
    redirectToLogin: false
  };

  try {
    // Check if the user already exists
    const userResponse = await getUserByUsernameService(data.username);

    if (userResponse?.data?.statusCode === 200) {
      const userStatus = userResponse.data?.data?.status;

      if (userStatus === 'PENDING') {
        return {
          ...returnValue,
          alertSeverity: 'error',
          alertMessage: 'Your registration is pending for HR approval!',
          redirectToLogin: true
        };
      }

      if (userStatus === 'APPROVED') {
        return {
          ...returnValue,
          alertSeverity: 'error',
          alertMessage: 'You are already signed up!',
          redirectToLogin: true
        };
      }
    }

    // If the user does not exist (404), proceed with signup
    if (userResponse?.data?.statusCode === 404) {
      const roleResponse = await getRoleByTitleService('INTERVIEWER');
      const roleData = roleResponse?.data.data || {};

      const requestBody = {
        username: data.username,
        password: data.password,
        status: data.status || 'PENDING',
        roles: [roleData],
        activeDate: data.activeDate || new Date().toISOString(),
        inactiveDate: data.inactiveDate || null
      };

      const signUpResponse = await signUpForm(requestBody);

      if (signUpResponse?.status !== 200) {
        console.error('Signup failed:', signUpResponse);
        return {
          ...returnValue,
          alertSeverity: 'error',
          alertMessage: 'Signup process failed! Please try again.'
        };
      }

      const createdUser = signUpResponse.data?.data;

      // Add associated employee information
      const employeeRequestBody = {
        employeeId: data.username,
        fullName: data.fullName,
        channel: data.channel,
        designation: data.designation,
        user: createdUser
      };

      await addEmployeeService(employeeRequestBody);

      return {
        ...returnValue,
        alertSeverity: 'success',
        alertMessage: 'Account created successfully! Please log in now.',
        redirectToLogin: true
      };
    }

    // Handle unexpected scenarios
    return {
      ...returnValue,
      alertSeverity: 'error',
      alertMessage: 'Signup process failed! Please try again.',
      redirectToLogin: true
    };
  } catch (error) {
    console.error('Error during signup process:', error);

    return {
      ...returnValue,
      alertSeverity: 'error',
      alertMessage: 'An unexpected error occurred! Please try again.'
    };
  }
};
