import axios from 'axios';

const API_BASE = 'https://hireiq-ai-recruitment-backend.onrender.com';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Jobs
export const createJob = async (data: any) => {
  const res = await api.post('/api/jobs', data);
  return res.data;
};

export const getJobs = async () => {
  const res = await api.get('/api/jobs');
  return res.data;
};

// Candidates
export const submitApplication = async (formData: FormData) => {
  const res = await api.post('/api/candidate-application-submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getCandidates = async () => {
  const res = await api.get('/api/candidates');
  return res.data;
};

export const getCandidate = async (id: string) => {
  const res = await api.get(`/api/candidates/${id}`);
  return res.data;
};
