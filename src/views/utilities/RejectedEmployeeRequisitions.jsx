import { useEffect, useState } from 'react';
import { getUserData } from '../../context/UserContext';

// components
import DatatableWithToolbarComponent from './DatatableWithToolbarComponent';

// services
import { getManpowerRequisitionsService } from '../../services/ApiServices';

export default function RejectedEmployeeRequisitions() {
  const user = getUserData();

  const [requisitionList, setRequisitionList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundText, setNotFoundText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getManpowerRequisitionsService(user.token, 'REJECTED');

        if (response.data?.statusCode === 200) {
          const requisitions = response.data.data;

          const customColumns = [
            { field: 'id', headerName: 'Serial' },
            { field: 'requiredPosition', headerName: 'Position', flex: 1 },
            { field: 'numberOfEmployee', headerName: 'Vacancy' },
            { field: 'department', headerName: 'Department', flex: 1 },
            { field: 'reasonForRequest', headerName: 'Reason', flex: 1 },
            { field: 'isBudgeted', headerName: 'Budgeted?' },
            { field: 'replacementOf', headerName: 'Replacement Of' },
            { field: 'creationDate', headerName: 'Requisition Date' },
            { field: 'remarks', headerName: 'Remarks' }
          ];

          const filteredData = requisitions.map((row) =>
            customColumns.reduce((acc, col) => {
              acc[col.field] = row[col.field];
              return acc;
            }, {})
          );

          setColumns(customColumns);
          setRequisitionList(filteredData);
        } else if (response.data?.statusCode === 404) {
          setNotFoundText('No rejected requisitions are available!');
        } else {
          console.error('Error fetching candidate details:', response.data?.data);
          alert('Process failed! Try again');
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <DatatableWithToolbarComponent
        loading={loading}
        isLoading={isLoading}
        columns={columns}
        contents={requisitionList}
        notFoundText={notFoundText}
      />
    </>
  );
}
