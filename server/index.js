const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  } 
});

const cors = require('cors');
const {v4 : uuidv4} = require('uuid');

const port = 4000;
const invoices = [];

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});

app.get('/invoice', (req, res) => {
  res.json({ data: invoices.filter(inv => inv.status === 'pending') });
});

app.post('/invoice', (req, res) => {
  const invoice = { ...req.body, status: 'pending', id: uuidv4() };
  invoices.push(invoice);

  io.emit('loadInvoices', invoices.filter(inv => inv.status === 'pending'));
  res.json({ message: 'invoice submitted successfully' });
});

app.put('/approve/:id', (req, res) => {
  const invId = req.params.id;

  const selectedInvoice = invoices.find(inv => inv.id === invId);
  const index = invoices.findIndex(inv => inv.id === invId);

  invoices[index] = { ...selectedInvoice, status: 'approved' };

  res.json({ message: 'invoice updated successfully' });
});

io.on('connection', (socket) => {
  console.log('a user connected');
});