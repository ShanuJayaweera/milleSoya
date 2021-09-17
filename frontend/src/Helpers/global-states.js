import React, { useState } from 'react';

const useGlobalState = () => {
  const [selectedApplicationIds, setSelectedApplicationIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [applications, setApplicationsData] = useState([]);

  return {
    selectedApplicationIds,
    setSelectedApplicationIds,
    limit,
    setLimit,
    page,
    setPage,
    enqueueSnackbar,
    closeSnackbar,
    applications,
    setApplicationsData
  };
};