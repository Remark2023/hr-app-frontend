/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

// styles
import '../styles/interview-evaluation.css';
import '../styles/utils.css';

FormTabsPage.propTypes = {
  candidate: PropTypes.object
};

export default function FormTabsPage({ candidate }) {
  console.log(candidate);
  const currentFacilities = candidate.facilitiesInfo.filter((facility) => facility.facilityType === 'CURRENT');
  const expectedFacilities = candidate.facilitiesInfo.filter((facility) => facility.facilityType === 'EXPECTED');
  const approvedFacilities = candidate.facilitiesInfo.filter((facility) => facility.facilityType === 'APPROVED');

  let total = 0;
  let averageMarks = 0;
  let percentageMarks = 0;

  if (candidate.evaluationInfo.length > 0) {
    candidate.evaluationInfo.forEach((element) => {
      total += element.totalMarks;
    });

    averageMarks = total / candidate.evaluationInfo.length;

    if (candidate.evaluationInfo[0].outOfMarks) {
      percentageMarks = (averageMarks / (candidate.evaluationInfo[0].outOfMarks * 5)) * 100;
    }
  }

  const performance =
    averageMarks >= 45
      ? 'Outstanding'
      : averageMarks >= 31
        ? 'Good'
        : averageMarks >= 23
          ? 'Average'
          : averageMarks >= 17
            ? 'Fair'
            : 'Poor';

  return (
    <>
      {/* header section  */}
      <div className="headline">
        <h1>REMARK</h1>
        <h2>INTERVIEW EVALUATION FORM</h2>
      </div>
      <div className="display-flex">
        <div className="display-flex half-width">
          <div className="key-value">Candidate Name:</div>
          <div>{candidate.fullName}</div>
        </div>
        <div className="display-flex half-width">
          <div className="key-value">Age:</div>
          <div>{candidate.age}</div>
        </div>
      </div>
      <div className="display-flex">
        <div className="display-flex half-width">
          <div className="key-value">Contact Number:</div>
          <div>{candidate.contactNumber}</div>
        </div>
        <div className="display-flex half-width">
          <div className="key-value">Interview Date:</div>
          <div>{candidate.interviewDate}</div>
        </div>
      </div>

      {/* education section  */}
      <table className="full-width">
        <tr>
          <th rowspan="3">Last Education</th>
          <th>Exam</th>
          <th>Subject</th>
          <th>Institute</th>
          <th>Year</th>
          <th>Result</th>
        </tr>
        <tr>
          <td rowSpan={2}>{candidate.lastEducationExam}</td>
          <td rowSpan={2}>{candidate.lastEducationSubject}</td>
          <td rowSpan={2}>{candidate.lastEducationInstitute}</td>
          <td rowSpan={2}>{candidate.lastEducationYear}</td>
          <td rowSpan={2}>{candidate.lastEducationResult}</td>
        </tr>
        <tr></tr>
      </table>

      {/* experience section  */}
      <table className="full-width">
        <tr>
          <th rowSpan={5}>
            <label>
              <input type="checkbox" checked={candidate.haveExperiences} disabled></input>
              Experienced
            </label>
            <label>
              <input type="checkbox" checked={!candidate.haveExperiences} disabled></input>
              Fresh
            </label>
          </th>
          <th>Experience Field</th>
          <th>Type of Organization</th>
          <th>Years</th>
        </tr>
        <tr>
          <td rowSpan={2}>{candidate.experiences[0]?.experienceField || ''}</td>
          <td rowSpan={2}>{candidate.experiences[0]?.organization || ''}</td>
          <td rowSpan={2}>{candidate.experiences[0]?.years || ''}</td>
        </tr>
        <tr></tr>
        <tr>
          <td rowSpan={2}>{candidate.experiences[1]?.experienceField || ''}</td>
          <td rowSpan={2}>{candidate.experiences[1]?.organization || ''}</td>
          <td rowSpan={2}>{candidate.experiences[1]?.years || ''}</td>
        </tr>
        <tr></tr>
      </table>

      <h3 style={{ border: '1.5px solid', textAlign: 'center' }}>INTERVIEW FOR THE POSITION</h3>
      <div className="display-flex">
        <div className="display-flex half-width">
          <div className="key-value">SBU:</div>
          <div>{currentFacilities[0]?.sbu || ''}</div>
        </div>
        <div className="display-flex half-width">
          <div className="key-value">Department:</div>
          <div>{currentFacilities[0]?.department || ''}</div>
        </div>
      </div>
      <div className="display-flex">
        <div className="display-flex half-width">
          <div className="key-value">Reports To:</div>
          <div>{currentFacilities[0]?.reportsTo || ''}</div>
        </div>
        <div className="display-flex half-width">
          <div className="key-value">Designation:</div>
          <div>{currentFacilities[0]?.designation || ''}</div>
        </div>
      </div>

      <h3 style={{ border: '1.5px solid', textAlign: 'center' }}>MARKETING FROM THE BOARD OF INTERVIEWER</h3>
      <table className="full-width">
        <tr>
          <th rowSpan={3}>Interviewer Name</th>
          <th rowSpan={2}>Attire & Body Language</th>
          <th rowSpan={2}>Work Knowledge</th>
          <th rowSpan={2}>Team Player</th>
          <th rowSpan={2}>Problem Solving Skills</th>
          <th rowSpan={2}>Communication Skills</th>
          <th rowSpan={3}>Total Marks</th>
          <th rowSpan={3}>Signature</th>
        </tr>
        <tr></tr>
        <tr>
          <td>{candidate.evaluationInfo[0]?.outOfMarks || 10}</td>
          <td>{candidate.evaluationInfo[0]?.outOfMarks || 10}</td>
          <td>{candidate.evaluationInfo[0]?.outOfMarks || 10}</td>
          <td>{candidate.evaluationInfo[0]?.outOfMarks || 10}</td>
          <td>{candidate.evaluationInfo[0]?.outOfMarks || 10}</td>
        </tr>
        {candidate.evaluationInfo.map((field, fieldIndex) => (
          <tr key={fieldIndex}>
            <td>{field.submittedBy}</td>
            <td>{field.attireBodyLanguage}</td>
            <td>{field.workKnowledge}</td>
            <td>{field.teamPlayer}</td>
            <td>{field.problemSolvingSkill}</td>
            <td>{field.communicationSkill}</td>
            <td>{field.totalMarks}</td>
            <td>{field.submittedBy}</td>
          </tr>
        ))}
        <tr>
          <td colSpan={6}>Total Average Marks:</td>
          <td>{averageMarks > 0 ? averageMarks : ''} / 50</td>
          <td>{percentageMarks > 0 ? percentageMarks : ''}%</td>
        </tr>
      </table>

      <div style={{ display: 'flex' }}>
        <table className="full-width">
          <tr>
            <th colSpan={4}>CHECK LIST</th>
          </tr>

          <tr>
            <td>Intrested to join</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.interestedToJoin} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.interestedToJoin} disabled></input>
                No
              </label>
            </td>
            <td rowSpan={2}>Work Anywhere in BD</td>
            <td rowSpan={2}>
              <label>
                <input type="checkbox" checked={candidate.workAnywhereInBd} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.workAnywhereInBd} disabled></input>
                No
              </label>
            </td>
          </tr>

          <tr>
            <td>Bond 2 Years</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.bond2Years} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.bond2Years} disabled></input>
                No
              </label>
            </td>
          </tr>

          <tr>
            <td>Bond 5 Years</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.bond5Years} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.bond5Years} disabled></input>
                No
              </label>
            </td>
            <td>Work at Factory</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.workAtFactory} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.workAtFactory} disabled></input>
                No
              </label>
            </td>
          </tr>

          <tr>
            <td>Have passport</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.havePassport} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.havePassport} disabled></input>
                No
              </label>
            </td>
            <td>Operate Comp.</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.operateComp} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.operateComp} disabled></input>
                No
              </label>
            </td>
          </tr>

          <tr>
            <td>Have Driving License</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.haveDrivingLicense} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.haveDrivingLicense} disabled></input>
                No
              </label>
            </td>
            <td>Agreed Terms</td>
            <td>
              <label>
                <input type="checkbox" checked={candidate.agreedTerms} disabled></input>
                Yes
              </label>
              <label>
                <input type="checkbox" checked={!candidate.agreedTerms} disabled></input>
                No
              </label>
            </td>
          </tr>
        </table>

        <table style={{ marginLeft: '1rem', width: '35%' }}>
          <tr>
            <th colSpan="2">Overall Performance</th>
          </tr>
          <tr>
            <td>45 - 50</td>
            <td style={{ textAlign: 'start' }}>
              <label>
                <input type="checkbox" checked={performance === 'Outstanding'} disabled></input>
                Outstanding
              </label>
            </td>
          </tr>

          <tr>
            <td>31 - 44</td>
            <td style={{ textAlign: 'start' }}>
              <label>
                <input type="checkbox" checked={performance === 'Good'} disabled></input>
                Good
              </label>
            </td>
          </tr>
          <tr>
            <td>23 - 30</td>
            <td style={{ textAlign: 'start' }}>
              <label>
                <input type="checkbox" checked={performance === 'Average'} disabled></input>
                Average
              </label>
            </td>
          </tr>
          <tr>
            <td>17 - 22</td>
            <td style={{ textAlign: 'start' }}>
              <label>
                <input type="checkbox" checked={performance === 'Fair'} disabled></input>
                Fair
              </label>
            </td>
          </tr>
          <tr>
            <td>0 - 16</td>
            <td style={{ textAlign: 'start' }}>
              <label>
                <input type="checkbox" checked={performance === 'Poor'} disabled></input>
                Poor
              </label>
            </td>
          </tr>
        </table>
      </div>

      {/* family profile section  */}
      <table className="full-width page-break-after">
        <tr>
          <th colSpan={3}>FAMILY PROFILE</th>
        </tr>
        <tr>
          <th>Father</th>
          <th>Mother</th>
          <th>Number of Siblings</th>
        </tr>
        <tr>
          <td>{candidate.fatherName}</td>
          <td>{candidate.motherName}</td>
          <td>{candidate.numberOfSiblings}</td>
        </tr>
      </table>

      {/* reference profile section  */}
      <table className="full-width">
        <tr>
          <th>Reference Name</th>
          <th>Relation</th>
          <th>Designation & Address</th>
        </tr>
        <tr>
          <td>{candidate.referenceName}</td>
          <td>{candidate.referenceRelation}</td>
          <td>{candidate.referenceDesignation}</td>
        </tr>
      </table>

      {/* facilities profile section  */}
      <table className="full-width">
        <tr>
          <th></th>
          <th>Current</th>
          <th>Expected/Offer</th>
        </tr>
        <tr>
          <th>Company</th>
          <td>{currentFacilities[0]?.company || ''}</td>
          <td>{expectedFacilities[0]?.company || ''}</td>
        </tr>
        <tr>
          <th>SBU</th>
          <td>{currentFacilities[0]?.sbu || ''}</td>
          <td>{expectedFacilities[0]?.sbu || ''}</td>
        </tr>
        <tr>
          <th>Department</th>
          <td>{currentFacilities[0]?.department || ''}</td>
          <td>{expectedFacilities[0]?.department || ''}</td>
        </tr>
        <tr>
          <th>Job Grade</th>
          <td>{currentFacilities[0]?.jobGrade || ''}</td>
          <td>{expectedFacilities[0]?.jobGrade || ''}</td>
        </tr>
        <tr>
          <th>Reports to</th>
          <td>{currentFacilities[0]?.reportsTo || ''}</td>
          <td>{expectedFacilities[0]?.reportsTo || ''}</td>
        </tr>
        <tr>
          <th>Job location</th>
          <td>{currentFacilities[0]?.jobLocation || ''}</td>
          <td>{expectedFacilities[0]?.jobLocation || ''}</td>
        </tr>
      </table>

      <table className="full-width">
        <tr>
          <th></th>
          <th>Current</th>
          <th>Expected/Offer</th>
          <th>Approved</th>
        </tr>
        <tr>
          <th>Designation</th>
          <td>{currentFacilities[0]?.designation || ''}</td>
          <td>{expectedFacilities[0]?.designation || ''}</td>
          <td>{approvedFacilities[0]?.designation || ''}</td>
        </tr>
        <tr>
          <th>Salary</th>
          <td>{currentFacilities[0]?.salary || ''}</td>
          <td>{expectedFacilities[0]?.salary || ''}</td>
          <td>{approvedFacilities[0]?.salary || ''}</td>
        </tr>
        <tr>
          <th>Bonus</th>
          <td>{currentFacilities[0]?.bonus || ''}</td>
          <td>{expectedFacilities[0]?.bonus || ''}</td>
          <td>{approvedFacilities[0]?.bonus || ''}</td>
        </tr>
        <tr>
          <th>TA/Conveyance</th>
          <td>{currentFacilities[0]?.taOrConveyance || ''}</td>
          <td>{expectedFacilities[0]?.taOrConveyance || ''}</td>
          <td>{approvedFacilities[0]?.taOrConveyance || ''}</td>
        </tr>
        <tr>
          <th>DA/Food</th>
          <td>{currentFacilities[0]?.daOrFood || ''}</td>
          <td>{expectedFacilities[0]?.daOrFood || ''}</td>
          <td>{approvedFacilities[0]?.daOrFood || ''}</td>
        </tr>
        <tr>
          <th>Benefit/Allowance</th>
          <td>{currentFacilities[0]?.benefitOrAllowance || ''}</td>
          <td>{expectedFacilities[0]?.benefitOrAllowance || ''}</td>
          <td>{approvedFacilities[0]?.benefitOrAllowance || ''}</td>
        </tr>
        <tr>
          <th>PF/Gratuity</th>
          <td>{currentFacilities[0]?.pfOrGratuity || ''}</td>
          <td>{expectedFacilities[0]?.pfOrGratuity || ''}</td>
          <td>{approvedFacilities[0]?.pfOrGratuity || ''}</td>
        </tr>
        <tr>
          <th>Transport Facility</th>
          <td>{currentFacilities[0]?.transportFacility || ''}</td>
          <td>{expectedFacilities[0]?.transportFacility || ''}</td>
          <td>{approvedFacilities[0]?.transportFacility || ''}</td>
        </tr>
        <tr>
          <th>Incentive/KPI</th>
          <td>{currentFacilities[0]?.incentiveOrKpi || ''}</td>
          <td>{expectedFacilities[0]?.incentiveOrKpi || ''}</td>
          <td>{approvedFacilities[0]?.incentiveOrKpi || ''}</td>
        </tr>
        <tr>
          <th>Mobile Ceiling</th>
          <td>{currentFacilities[0]?.mobileCeiling || ''}</td>
          <td>{expectedFacilities[0]?.mobileCeiling || ''}</td>
          <td>{approvedFacilities[0]?.mobileCeiling || ''}</td>
        </tr>
        <tr>
          <th>Total CTC</th>
          <td>{currentFacilities[0]?.totalCtc || ''}</td>
          <td>{expectedFacilities[0]?.totalCtc || ''}</td>
          <td>{approvedFacilities[0]?.totalCtc || ''}</td>
        </tr>
      </table>

      {/* HR section  */}
      <table className="full-width">
        <tr>
          <th>Notice Period</th>
          <th>DOJ</th>
          <th>Probation Period</th>
          <th>Investigation</th>
        </tr>
        <tr>
          <td>{candidate.noticePeriods}</td>
          <td>{candidate.doj}</td>
          <td>{candidate.probationPeriod}</td>
          <td>{candidate.investigation}</td>
        </tr>
      </table>

      <table className="full-width">
        <tr>
          <th rowSpan={2} style={{ width: '40%' }}>
            HR Note (if any)
          </th>
          <td rowSpan={2}>{candidate.hrNotes}</td>
        </tr>
        <tr></tr>
      </table>

      <table className="full-width">
        <tr>
          <th rowSpan={2} style={{ width: '40%' }}>
            Management Comments
          </th>
          <td rowSpan={2}>{candidate.managementComment}</td>
        </tr>
        <tr></tr>
      </table>

      {/* Signatures */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5rem' }}>
        <div>
          <div style={{ borderBottom: '2px solid' }}></div>
          <div>Signature (Forwarded by HR)</div>
        </div>
        <div>
          <div style={{ borderBottom: '2px solid' }}></div>
          <div>Recommendation of HOB/HOD</div>
        </div>
        <div>
          <div style={{ borderBottom: '2px solid' }}></div>
          <div>Approved by Chairman/MD/Director</div>
        </div>
      </div>
    </>
  );
}
