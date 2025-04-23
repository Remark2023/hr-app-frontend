/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../../utilities/Form';

// components
import AuthFooter from 'ui-component/cards/AuthFooter';

// api services
import {
  addCandidateExperienceInfoService,
  addCandidateFacilitiesInfoService,
  addCandidateInfoService
} from '../../../services/ApiServices';

// styles
import '../../../styles/utils.css';

export default function EvaluationFormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  const [candidateExperienceList, setCandidateExperienceList] = useState([{ company: '', department: '', from: null, to: null }]);
  const [showExperienceForm, setShowExperienceForm] = useState(true);
  const handleShowExperience = (value) => {
    setShowExperienceForm((prev) => !prev);
  };

  const [hideTransportAllowanceField, setHideTransportAllowanceField] = useState(true);
  const handleHideTransportAllowanceField = (value) => {
    if (value === 'Transport Allowance') setHideTransportAllowanceField(false);
    else setHideTransportAllowanceField(true);
  };

  const transportFacilityOptions = [
    { label: 'select a facility', value: '' },
    { label: 'Company Vehicle', value: 'Company Vehicle' },
    { label: 'Pick and Drop', value: 'Pick and Drop' },
    { label: 'Transport Allowance', value: 'Transport Allowance' }
  ];

  const experienceFields = [
    { label: 'COMPANY', name: 'company', type: 'text' },
    { label: 'DEPARTMENT', name: 'department', type: 'text' },
    { label: 'FROM', name: 'from', type: 'date' },
    { label: 'TO', name: 'to', type: 'date' }
  ];

  const [formErrors, setFormErrors] = useState({});
  const validateForm = (values) => {
    const errors = {};

    if (!values.interviewDate) {
      errors.interviewDate = 'Interview date is required';
    }

    if (Number(values.age) < 18) {
      errors.age = 'Must be at least 18 years old';
    }

    if (!values.fullName) {
      errors.fullName = 'Full name is required';
    }

    if (!values.nidNumber) {
      errors.nidNumber = 'NID/Birth Registration is required';
    } else if (!/^\d{10,17}$/.test(values.nidNumber)) {
      errors.nidNumber = 'NID should be 10 to 17 digits long';
    }

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (values.contactNumber && !/^\d{10,15}$/.test(values.contactNumber)) {
      errors.contactNumber = 'Invalid phone number';
    }

    if (values.salary && isNaN(values.salary)) {
      errors.salary = 'Salary must be a number';
    }

    return errors;
  };

  const handleSubmit = async (data) => {
    try {
      const today = new Date();
      const filteredArray = candidateExperienceList.filter((item) => Object.values(item).some((value) => value !== ''));

      const experiences = filteredArray.map(({ from, to }) => ({ from, to }));
      if (data.from) experiences.push({ from: data.from, to: today });

      const totalExperiences = countTotalYearsOfExperiences(experiences);

      const errorInputs = validateForm(data);
      if (Object.keys(errorInputs).length > 0) {
        setFormErrors(errorInputs);
        console.log(formErrors);

        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Format interviewDate to support LocalDateTime object if it exists
      const formattedDate = data.interviewDate ? new Date(data.interviewDate).toISOString() : null;

      const candidateRequestBody = {
        age: data.age ?? '',
        email: data.email ?? '',
        contactNumber: data.contactNumber ?? '',
        nidNumber: data.nidNumber ?? '',
        presentAddress: data.presentAddress ?? '',
        permanentAddress: data.permanentAddress ?? '',
        lastEducationExam: data.lastEducationExam ?? '',
        lastEducationSubject: data.lastEducationSubject ?? '',
        lastEducationInstitute: data.lastEducationInstitute ?? '',
        lastEducationYear: data.lastEducationYear ?? '',
        lastEducationResult: data.lastEducationResult ?? '',
        fatherName: data.fatherName ?? '',
        motherName: data.motherName ?? '',
        numberOfSiblings: data.numberOfSiblings ?? null,
        referenceRelation: data.referenceRelation ?? '',
        referenceDesignation: data.referenceDesignation ?? '',
        haveReference: !!data.haveReference,
        interviewDate: formattedDate,
        interestedToJoin: !!data.interestedToJoin,
        bond2Years: !!data.bond2Years,
        bond5Years: !!data.bond5Years,
        havePassport: !!data.havePassport,
        haveDrivingLicense: !!data.haveDrivingLicense,
        workAnywhereInBd: !!data.workAnywhereInBd,
        workAtFactory: !!data.workAtFactory,
        operateComp: !!data.operateComp,
        agreedTerms: !!data.agreedTerms,
        haveExperiences: data.haveExperiences ?? null,
        experiences: data.experiences ?? [],
        facilitiesInfo: data.facilitiesInfo ?? [],
        evaluationInfo: data.evaluationInfo ?? [],
        fullName: data.fullName ?? '',
        totalYearsOfExperience: totalExperiences,
        referenceName: data.referenceName ?? ''
      };
      const candidateResponse = await addCandidateInfoService(candidateRequestBody);

      if (candidateResponse?.data?.statusCode === 200) {
        const facilitiesRequestBody = {
          facilityType: 'CURRENT',
          company: data.currentCompany ?? '',
          sbu: data.sbu ?? '',
          department: data.currentDepartment ?? '',
          jobGrade: data.jobGrade ?? '',
          reportsTo: data.reportsTo ?? '',
          jobLocation: data.jobLocation ?? '',
          designation: data.designation ?? '',
          salary: data.salary ?? null,
          bonus: data.bonus ?? '',
          taOrConveyance: data.taOrConveyance ?? '',
          daOrFood: data.daOrFood ?? '',
          benefitOrAllowance: data.benefitOrAllowance ?? '',
          pfOrGratuity: data.pfOrGratuity ?? '',
          transportFacility: data.transportFacility ?? '',
          transportFacilityAllowance: data.transportAllowanceAmount ?? '',
          incentiveOrKpi: data.incentiveOrKpi ?? '',
          mobileCeiling: data.mobileCeiling ?? '',
          totalCtc: data.totalCtc ?? '',
          fromDate: data.from,
          candidate: candidateResponse.data.data
        };
        await addCandidateFacilitiesInfoService(facilitiesRequestBody);

        await handleExperienceSubmit(candidateResponse.data.data);

        navigate('/candidates/thankyou', { replace: true });
      } else {
        alert('Process failed! Please try again.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Process failed! Please try again.');
    }
  };

  const countTotalYearsOfExperiences = (data) => {
    let totalMonths = 0;

    data.forEach((element) => {
      if (!element.from || !element.to) return;

      const from = new Date(element.from);
      const to = new Date(element.to);

      if (isNaN(from.getTime()) || isNaN(to.getTime())) return;

      const years = to.getFullYear() - from.getFullYear();
      const months = to.getMonth() - from.getMonth();
      const days = to.getDate() - from.getDate();

      let total = years * 12 + months;

      if (days < 0) {
        total -= 1;
      }

      totalMonths += total;
    });

    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;

    return `${totalYears} Years ${remainingMonths} Months`;
  };

  const handleExperienceChange = (index, name, value) => {
    const updatedRows = [...candidateExperienceList];
    updatedRows[index][name] = value;
    setCandidateExperienceList(updatedRows);
  };

  const handleAddRow = () => {
    setCandidateExperienceList([...candidateExperienceList, { company: '', department: '', from: null, to: null }]);
  };

  const handleExperienceSubmit = async (candidate) => {
    try {
      const filteredArray = candidateExperienceList.filter((item) => Object.values(item).some((value) => value !== ''));

      for (let i = 0; i < filteredArray.length; i++) {
        const lineInfo = filteredArray[i];

        const requestBody = {
          experienceField: lineInfo.department || '',
          organization: lineInfo.company || '',
          fromDate: lineInfo.from,
          toDate: lineInfo.to,
          candidate: candidate
        };

        const response = await addCandidateExperienceInfoService(requestBody);

        if (response?.data?.statusCode !== 200) {
          console.error(`Submission failed for your experience entry ${i + 1}. Please check your data.`);
          return;
        }
      }
    } catch (err) {
      console.error('Error:', err.message);
    } finally {
      setCandidateExperienceList([{ company: '', department: '' }]);
    }
  };

  const fields = [
    { label: 'INTERVIEW DATE*', name: 'interviewDate', type: 'date' },
    { label: 'FULL NAME*', name: 'fullName', type: 'text' },
    { label: 'NID/BIRTH REGISTRATION*', name: 'nidNumber', type: 'text' },
    { label: 'AGE', name: 'age', type: 'text' },

    { label: 'EMAIL ADDRESS', name: 'email', type: 'text', placeholder: 'example@gmail.com' },
    { label: 'CONTACT NUMBER', name: 'contactNumber', type: 'text' },

    { label: 'PRESENT ADDRESS', name: 'presentAddress', type: 'text' },
    { label: 'PERMANENT ADDRESS', name: 'permanentAddress', type: 'text' },

    { label: 'LAST EDUCATION EXAM', name: 'lastEducationExam', type: 'text' },
    { label: 'LAST EDUCATION SUBJECT', name: 'lastEducationSubject', type: 'text' },
    { label: 'LAST EDUCATION RESULT', name: 'lastEducationResult', type: 'text' },
    { label: 'LAST EDUCATION YEAR', name: 'lastEducationYear', type: 'text' },
    { label: 'LAST EDUCATION INSTITUTE', name: 'lastEducationInstitute', type: 'text' },

    { label: 'FATHER NAME', name: 'fatherName', type: 'text' },
    { label: 'MOTHER NAME', name: 'motherName', type: 'text' },

    { label: 'CURRENT COMPANY', name: 'currentCompany', type: 'text', placeholder: 'enter your current company' },
    { label: 'CURRENT DEPARTMENT', name: 'currentDepartment', type: 'text', placeholder: 'enter your current department' },
    { label: 'FROM', name: 'from', type: 'date' },
    { label: 'PREVIOUS EXPERIENCES', name: 'addExperience', type: 'checkbox', action: handleShowExperience },
    {
      label: '',
      name: 'experiences',
      type: 'table',
      addRow: handleAddRow,
      tableFields: experienceFields,
      showTable: showExperienceForm,
      tableFieldValueList: candidateExperienceList,
      handleTableValueChange: handleExperienceChange
    },
    { label: 'GROSS SALARY', name: 'salary', type: 'text', placeholder: 'enter your current salary' },
    { label: 'BONUS', name: 'bonus', type: 'text', placeholder: 'enter your current bonus' },
    { label: 'TA/CONVEYANCE', name: 'taOrConveyance', type: 'text', placeholder: 'enter your current TA' },
    { label: 'DA/FOOD', name: 'daOrFood', type: 'text', placeholder: 'enter your current DA' },
    { label: 'MEDICAL/LIFE INSURANCE', name: 'benefitOrAllowance', type: 'text', placeholder: 'enter your current allowance' },

    { label: 'PF/GRATUITY', name: 'pfOrGratuity', type: 'text', placeholder: 'enter your current PF or Gratuity' },
    { label: 'MOBILE CEILING', name: 'mobileCeiling', type: 'text', placeholder: 'enter your current mobile ceiling' },
    {
      label: 'TRANSPORT FACILITY',
      name: 'transportFacility',
      type: 'select',
      options: transportFacilityOptions,
      action: handleHideTransportAllowanceField
    },
    {
      label: 'TRANSPORT ALLOWANCE AMOUNT',
      name: 'transportAllowanceAmount',
      type: 'text',
      placeholder: 'enter the amount',
      hide: hideTransportAllowanceField
    }
  ];

  return (
    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#eef2f6' }}>
      <div className="form-max-width center-margin">
        <h2>
          {' '}
          <span style={{ color: 'crimson' }}>Welcome!</span> Please enter your information{' '}
        </h2>
        <Form
          fields={fields}
          initialValues={formData}
          rowsConfig={[8, 5, 2, 5]}
          onSubmit={handleSubmit}
          resetAfterSubmit={true}
          isSeparated={true}
          validationErrors={formErrors}
        />
      </div>

      <AuthFooter />
    </div>
  );
}
