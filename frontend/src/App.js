import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const addItem = () => {
    axios.post('http://localhost:5000/items', { nama, deskripsi })
      .then(response => {
        setItems([...items, response.data]);
        setNama('');
        setDeskripsi('');
      })
      .catch(error => console.error(error));
  };

  const updateItem = () => {
    axios.put(`http://localhost:5000/items/${editId}`, { nama, deskripsi })
      .then(response => {
        setItems(items.map(item => item._id === editId ? response.data : item));
        setNama('');
        setDeskripsi('');
        setEditId(null);
      })
      .catch(error => console.error(error));
  };

  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => setItems(items.filter(item => item._id !== id)))
      .catch(error => console.error(error));
  };

  const handleEdit = (item) => {
    setNama(item.nama);
    setDeskripsi(item.deskripsi);
    setEditId(item._id);
  };

  return (
    <div>
      <h1>Eka Wahyuni</h1>
      <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" />
      <input type="text" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi"/>
      <button onClick={editId ? updateItem : addItem}>
        {editId ? 'Update Item' : 'Add Item'}
      </button>

      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.nama} | {item.deskripsi }
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
