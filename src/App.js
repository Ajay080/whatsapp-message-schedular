import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('');
  const [messages, setMessages] = useState([]);
  const [editId, setEditId] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const response = await fetch(`${API_BASE_URL}/messages`);
    const data = await response.json();
    setMessages(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_BASE_URL}/messages/${editId}` : `${API_BASE_URL}/schedule`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editId, phone, message, time }),
    });

    if (response.ok) {
      alert('Message scheduled successfully!');
      setPhone('');
      setMessage('');
      setTime('');
      setEditId(null);
      fetchMessages();
    } else {
      alert('Failed to schedule message.');
    }
  };

  const handleEdit = (msg) => {
    setPhone(msg.phone);
    setMessage(msg.message);
    setTime(msg.time);
    setEditId(msg.id);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Message deleted successfully!');
      fetchMessages();
    } else {
      alert('Failed to delete message.');
    }
  };

  return (
    <div>
      <h1>WhatsApp Message Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label>Message:</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <div>
          <label>Time (24-hour format, HH:MM):</label>
          <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <button type="submit">{editId ? 'Update Message' : 'Schedule Message'}</button>
      </form>

      <h2>Scheduled Messages</h2>
      <table>
        <thead>
          <tr>
            <th>Phone Number</th>
            <th>Time</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td data-label="Phone Number">{msg.phone}</td>
              <td data-label="Time">{msg.time}</td>
              <td data-label="Message">{msg.message}</td>
              <td className='butts'>
                <button onClick={() => handleEdit(msg)}>Edit</button>
                <button onClick={() => handleDelete(msg.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
