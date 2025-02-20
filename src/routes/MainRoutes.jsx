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
const UserCreationPage = Loadable(lazy(() => import('views/pages/hr/UserCreationPage')));
const EmployeeRequisitionForm = Loadable(lazy(() => import('views/pages/EmployeeRequisitionForm')));
const RoleAssignmentPage = Loadable(lazy(() => import('views/pages/hr/RoleAssignmentPage')));
const ShowEmployeeRequisitionsPage = Loadable(lazy(() => import('views/pages/hr/ShowEmployeeRequisitionsPage')));
const EmployeeRequisitionApprovalPage = Loadable(
  lazy(() => import('views/pages/employeeRequisionApprover/EmployeeRequisitionApprovalPage'))
);

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
      element: <SignupApprovalPage />
    },
    {
      path: 'user-creation',
      element: <UserCreationPage />
    },
    {
      path: 'role-assignment',
      element: <RoleAssignmentPage />
    },
    {
      path: '/employeeRequisition/form',
      element: <EmployeeRequisitionForm />
    },
    {
      path: '/employeeRequisition/approval',
      element: <EmployeeRequisitionApprovalPage />
    },
    {
      path: '/employeeRequisition/show',
      element: <ShowEmployeeRequisitionsPage />
    },
    {
      path: 'interview-evaluation',
      element: (
        <InterviewEvaluationForm
          candidate={{
            candidateNumber: null,
            fullName: '',
            age: '',
            email: '',
            contactNumber: '',
            nidNumber: '',
            presentAddress: '',
            permanentAddress: '',
            lastEducationExam: '',
            lastEducationSubject: '',
            lastEducationInstitute: '',
            lastEducationYear: '',
            lastEducationResult: '',
            fatherName: '',
            motherName: '',
            numberOfSiblings: null,
            referenceRelation: '',
            referenceDesignation: '',
            haveReference: false,
            noticePeriods: '',
            hrNotes: '',
            managementComment: null,
            doj: null,
            probationPeriod: '',
            investigation: null,
            interviewDate: '',
            interestedToJoin: false,
            bond2Years: false,
            bond5Years: false,
            havePassport: false,
            haveDrivingLicense: false,
            workAnywhereInBd: false,
            workAtFactory: false,
            operateComp: false,
            agreedTerms: false,
            haveExperiences: null,
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
                id: null,
                submittedBy: '',
                submittedDate: null,
                attireBodyLanguage: null,
                workKnowledge: null,
                teamPlayer: null,
                problemSolvingSkill: null,
                communicationSkill: null,
                outOfMarks: null,
                totalMarks: null,
                avgMarks: null,
                performance: ''
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
