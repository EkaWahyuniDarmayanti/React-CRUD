import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [editId, setEditId] = useState(null);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchItems(storedToken);
    }
  }, []);

  const fetchItems = (token) => {
    axios.get('http://localhost:5000/items', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  };

  const addItem = () => {
    axios.post('http://localhost:5000/items', { nama, deskripsi }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setItems([...items, response.data]);
        setNama('');
        setDeskripsi('');
      })
      .catch(error => console.error(error));
  };

  const updateItem = () => {
    axios.put(`http://localhost:5000/items/${editId}`, { nama, deskripsi }, { 
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setItems(items.map(item => item._id === editId ? response.data : item));
        setNama('');
        setDeskripsi('');
        setEditId(null);
      })
      .catch(error => console.error(error));
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`,{
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error(error));
  };

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { username, password })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setIsLoggedIn(true);
        fetchItems(response.data.token);
      })
      .catch(error => console.error(error));
  };

  const handleRegister = () => {
    axios.post('http://localhost:5000/register', { username, password })
      .then(() => {
        alert('Registration successful');
      })
      .catch(error => console.error(error));
  };


  const handleEdit = (item) => {
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setEditId(item._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Eka Wahyuni</h1>
      {!isLoggedIn ? (
        <div>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div>

          <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama" />
          <input type="text" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} placeholder="Deskripsi" />

          <button onClick={editId ? updateItem : addItem}>
            {editId ? 'Update Item' : 'Add Item'}
          </button>
          <ul>
            {items.map(item => (
              <li key={item._id}>
                {item.nama} | {item.deskripsi}
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => deleteItem(item._id)}>Delete</button>
              </li>
            ))}
          </ul>
            <br></br>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
