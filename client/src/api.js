import { toCamelCase } from './util/parseData';

const API_URL = 'http://localhost:4000';

export const getInvoices = async () => {
  const response = await fetch(`${API_URL}/invoice`);
  const data = await response.json();

  return toCamelCase(data.data);
};

export const approveInvoice = async (id) => {
  const response = await fetch(`${API_URL}/approve/${id}`, { method: 'PUT' });
  const data = await response.json();

  return data.message;
}
