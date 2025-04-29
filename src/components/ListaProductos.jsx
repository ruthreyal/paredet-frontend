import React, { useEffect, useState } from 'react';
import productoService from '../services/productoService';

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    productoService.getAllProductos()
      .then(response => {
        setProductos(response.data);
      })
      .catch(err => {
        setError('Error al cargar productos');
        console.error(err);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {productos.map(producto => (
          <li key={producto.id} className="list-group-item">
            <strong>{producto.nombre}</strong> – {producto.precio} €
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaProductos;
