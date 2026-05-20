import API from './api';

export const getCandidates = async () => {
  const response = await API.get('/candidates');
  return response.data;
};

export const getCandidateById = async (id) => {
  const response = await API.get(`/candidates/${id}`);
  return response.data;
};

export const submitCandidate = async (candidateData) => {
  const response = await API.post('/candidates', candidateData);
  return response.data;
};

export const triggerVerification = async (candidateId) => {
  const response = await API.post(`/verifications/trigger/${candidateId}`);
  return response.data;
};

export const getVerificationReport = async (candidateId) => {
  const response = await API.get(`/verifications/report/${candidateId}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get('/verifications/dashboard-stats');
  return response.data;
};
