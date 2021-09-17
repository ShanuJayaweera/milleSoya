/* eslint-disable quote-props */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-alert */
/* eslint-disable quotes */
/* eslint-disable implicit-arrow-linebreak */

const API_URL = 'http://127.0.0.1:8000';

const DefaultHeaders = {
  'access-control-allow-origin': '*',
  'content-type': 'application/json',
  // 'Authorization': `Token ${localStorage.getItem('token')}`
};

// const headers = DefaultHeaders;
const API_GET = async (url, response, reject, headers = DefaultHeaders) => {
  return fetch(`${API_URL}/${url}`, { method: 'get', headers })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      }
      const err = { status: response.status, message: response.statusText };
      console.log(err);
      throw err;
    })
    .then((data) => response(data))
    .catch((error) => reject(error));
};

const API_POST = async (
  url,
  data,
  response,
  reject,
  headers = DefaultHeaders
) => {
  fetch(`${API_URL}/${url}`, {
    method: 'post',
    headers,
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (res.ok) return res.json();
      const err = { status: res.status, message: res.statusText };
      throw err;
    })
    .then((result) => response(result))
    .catch((error) => reject(error));
};

const API_LOGIN_POST = async (
  url,
  data,
  response,
  reject,
  headers = {
    'access-control-allow-origin': '*',
    'content-type': 'application/json'
  }
) => {
  fetch(`${API_URL}/${url}`, {
    method: 'post',
    headers,
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (res.ok) return res.json();
      const err = { status: res.status, message: res.statusText };
      throw err;
    })
    .then((result) => { response(result); })
    .catch((error) => reject(error));
};

const API_UPDATE = async (
  url,
  data,
  response,
  reject,
  headers = DefaultHeaders
) =>
  fetch(`${API_URL}/${url}`, {
    method: 'put',
    headers,
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (res.ok) return res.json();
      const err = { status: res.status, message: res.statusText };
      throw err;
    })
    .then((result) => response(result))
    .catch((error) => reject(error));

const API_DELETE = async (
  url,
  response,
  reject,
  headers = DefaultHeaders
) =>
  fetch(`${API_URL}/${url}`, {
    method: 'delete',
    headers
  })
    .then((res) => {
      if (res.ok) return res.json();
      const err = { status: res.status, message: res.statusText };
      throw err;
    })
    .then((result) => response(result))
    .catch((error) => reject(error));

const GetUserData = (url, response, reject) => API_GET(url, response, reject);
const LoginUser = (data, response, reject) => API_LOGIN_POST('api/login', data, response, reject);
const LogoutUser = (response, reject) => API_POST('api/logout', [], response, reject);

const CreateNewApplication = (data, response, reject) => API_POST('application/create', data, response, reject);
const UpdateApplication = (data, id, response, reject) => API_UPDATE(`application/${id}/update`, data, response, reject);
const DeleteApplication = (id, response, reject) => API_DELETE(`application/${id}/delete`, response, reject);
const GetApplicationsDataById = (id, response, reject) => API_GET(`application/${id}`, response, reject);
const GetAllApplicationsData = (response, reject) => API_GET('application/all', response, reject);

const CreateNewProvider = (data, response, reject) => API_POST('provider/create', data, response, reject);
const UpdateProvider = (data, id, response, reject) => API_UPDATE(`provider/${id}/update`, data, response, reject);
const DeleteProvider = (id, response, reject) => API_DELETE(`provider/${id}/delete`, response, reject);
const GetProviderDataById = (id, response, reject) => API_GET(`provider/${id}`, response, reject);
const GetAllProvidersData = (response, reject) => API_GET('provider/all', response, reject);

const CreateNewLicenseType = (data, response, reject) => API_POST('LicenseType/create', data, response, reject);
const UpdateLicenseType = (data, id, response, reject) => API_UPDATE(`LicenseType/${id}/update`, data, response, reject);
const DeleteLicenseType = (id, response, reject) => API_DELETE(`LicenseType/${id}/delete`, response, reject);
const GetLicenseTypeDataById = (id, response, reject) => API_GET(`LicenseType/${id}`, response, reject);
const GetAllLicenseTypeData = (response, reject) => API_GET('LicenseType/all', response, reject);

export {
  GetAllApplicationsData,
  CreateNewApplication,
  GetApplicationsDataById,
  UpdateApplication,
  GetUserData,
  DeleteApplication,
  CreateNewProvider,
  UpdateProvider,
  DeleteProvider,
  GetProviderDataById,
  GetAllProvidersData,
  CreateNewLicenseType,
  UpdateLicenseType,
  DeleteLicenseType,
  GetLicenseTypeDataById,
  GetAllLicenseTypeData,
  LoginUser,
  LogoutUser
};
