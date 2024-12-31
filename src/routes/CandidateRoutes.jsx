import { lazy } from 'react';

// Project imports
import MinimalLayout from 'layout/MinimalLayout';
import Loadable from 'ui-component/Loadable';

// Lazy-loaded authentication pages
const CandidatesEntryForm = Loadable(lazy(() => import('views/pages/candidates/CandidatesEntryForm')));
const ThankYouPage = Loadable(lazy(() => import('views/utilities/ThankYouPage')));

// ==============================|| CANDIDATE ROUTING ||============================== //
const CandidateRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/candidates/form',
      element: <CandidatesEntryForm />
    },
    {
      path: '/candidates/thankyou',
      element: <ThankYouPage />
    }
  ]
};

export default CandidateRoutes;
