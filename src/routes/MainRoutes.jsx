import { lazy } from 'react';
// Project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from '../routes/ProtectedRoutes'; // Import the ProtectedRoute

// Lazy-loaded main content
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const UtilsTypography = Loadable(lazy(() => import('views/utilities/ShowCandidatesPage')));
const DataTable = Loadable(lazy(() => import('views/utilities/DataTable')));
// const DataExportTable = Loadable(lazy(() => import('views/utilities/DataExportTable')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const CandidateEvalution = Loadable(lazy(() => import('views/pages/CandidateEvaluationForm')));
const FormTabsPage = Loadable(lazy(() => import('views/pages/hr/FacilitiesTabPage')));
const InterviewEvaluationForm = Loadable(lazy(() => import('../reports/InterviewEvaluationForm')));
const SignupApprovalPage = Loadable(lazy(() => import('views/pages/admin/SignupApprovalPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    // {
    //   path: '/',
    //   element: <Navigate to="/pages/login/login3" replace /> // Default to login if no user
    // },

    // Protected Routes
    {
      path: 'dashboard',
      element: <DashboardDefault />,
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },

    {
      path: 'utils',
      element: <UtilsTypography />,
      children: [
        {
          path: 'util-typography',
          element: <UtilsTypography />
        },
        {
          path: 'util-color',
          element: <UtilsColor />
        },
        {
          path: 'data-table',
          element: <DataTable />
        },
        // {
        //   path: 'dataExportTable',
        //   element: <DataExportTable />
        // },
        {
          path: 'util-shadow',
          element: <UtilsShadow />
        }
      ]
    },

    {
      path: 'candidate-evaluation',
      element: <CandidateEvalution />
    },
    {
      path: 'hr-entry-form',
      element: <FormTabsPage />
    },
    {
      path: 'sample-page',
      element: <SamplePage /> // No authentication required for this route
    },
    {
      path: 'signup-approval',
      element: <SignupApprovalPage /> // No authentication required for this route
    },
    {
      path: 'interview-evaluation',
      element: (
        <InterviewEvaluationForm
          candidate={{
            candidateNumber: 2,
            fullName: 'niloy hasan',
            age: '25',
            email: '',
            contactNumber: '',
            nidNumber: '',
            presentAddress: 'dhaka',
            permanentAddress: 'dhaka',
            lastEducationExam: 'bsc',
            lastEducationSubject: 'cse',
            lastEducationInstitute: 'ulab',
            lastEducationYear: '2022',
            lastEducationResult: '3.43',
            fatherName: '',
            motherName: '',
            numberOfSiblings: null,
            referenceRelation: '',
            referenceDesignation: '',
            haveReference: false,
            noticePeriods: '2',
            hrNotes: 'good',
            managementComment: null,
            doj: null,
            probationPeriod: '6',
            investigation: null,
            interviewDate: '2024-12-10',
            interestedToJoin: true,
            bond2Years: false,
            bond5Years: false,
            havePassport: true,
            haveDrivingLicense: false,
            workAnywhereInBd: true,
            workAtFactory: false,
            operateComp: true,
            agreedTerms: true,
            haveExperiences: true,
            experiences: [
              {
                id: 1,
                experienceField: null,
                organization: null,
                years: null
              },
              {
                id: 2,
                experienceField: null,
                organization: null,
                years: null
              }
            ],
            facilitiesInfo: [],
            evaluationInfo: [
              {
                id: 1,
                submittedBy: 'M1078',
                submittedDate: null,
                attireBodyLanguage: 8.0,
                workKnowledge: 8.0,
                teamPlayer: 8.0,
                problemSolvingSkill: 8.0,
                communicationSkill: 8.0,
                outOfMarks: 10.0,
                totalMarks: 40.0,
                avgMarks: 8.0,
                performance: 'good'
              }
            ],
            referenceName: ''
          }}
        />
      )
    }
  ]
};

export default MainRoutes;
