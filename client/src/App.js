import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getInvoices, approveInvoice } from './api';
import './App.css';
import { toCamelCase } from './util/parseData';

function App() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(-1);

  const onApprove = async (id, index) => {
    setButtonLoading(index);
    await approveInvoice(id);
    setButtonLoading(-1);
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const onLoadInvoice = (invs) => {
    setInvoices(toCamelCase([...invs]));
  }

  useEffect(() => {
    const socket = io('http://localhost:4000');
    
    socket.on('loadInvoices', onLoadInvoice);

  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
      setLoading(false);
    };

    fetch();
  }, []);

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      <h1>Invoices</h1>  
      <table>
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Vendor Name</th>
            <th>Vendor Addres</th>
            <th>Invoice Total</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 && invoices.map((invoice, index) => (
            <tr key={invoice.id}>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.vendorName}</td>
              <td>{invoice.remittanceAddress}</td>
              <td>{invoice.total}</td>
              <td>{invoice.invoiceDate}</td>
              <td>{invoice.dueDate}</td>
              <td>
                <button type="button" onClick={() => onApprove(invoice.id, index)}>{buttonLoading === index ? 'loading...' : 'Approve'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
