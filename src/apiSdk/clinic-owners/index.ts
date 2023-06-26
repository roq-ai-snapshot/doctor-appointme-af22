import axios from 'axios';
import queryString from 'query-string';
import { ClinicOwnerInterface, ClinicOwnerGetQueryInterface } from 'interfaces/clinic-owner';
import { GetQueryInterface } from '../../interfaces';

export const getClinicOwners = async (query?: ClinicOwnerGetQueryInterface) => {
  const response = await axios.get(`/api/clinic-owners${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createClinicOwner = async (clinicOwner: ClinicOwnerInterface) => {
  const response = await axios.post('/api/clinic-owners', clinicOwner);
  return response.data;
};

export const updateClinicOwnerById = async (id: string, clinicOwner: ClinicOwnerInterface) => {
  const response = await axios.put(`/api/clinic-owners/${id}`, clinicOwner);
  return response.data;
};

export const getClinicOwnerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/clinic-owners/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteClinicOwnerById = async (id: string) => {
  const response = await axios.delete(`/api/clinic-owners/${id}`);
  return response.data;
};
