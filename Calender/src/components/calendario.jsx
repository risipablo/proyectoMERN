import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendario.css';
import { NavLink } from 'react-router-dom';

// const serverFront = "http://localhost:3001";
const serverFront = 'https://servermern-yurb.onrender.com'

function Calendario() {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    axios.get(`${serverFront}/notes`)
      .then(response => setNotes(response.data))
      .catch(err => console.error(err));
  }, []);

  const onChange = (newDate) => {
    setDate(newDate);
    const dateString = newDate.toDateString();
    setCurrentNote(notes[dateString]?.note || '');
  };

  const addNote = () => {
    const dateString = date.toDateString();
    const updatedNotes = {
      ...notes,
      [dateString]: { note: currentNote }
    };
    setNotes(updatedNotes);
    setCurrentNote('');

    axios.post(`${serverFront}/notes`, { date: dateString, note: currentNote })
      .then(response => console.log('Nota añadida:', response.data))
      .catch(err => console.error('Error al agregar nota:', err));
  };

  // las notas están almacenadas en un objeto

  // const deleteNotes = (id) => {
  //   axios.delete(`${serverFront}/delete-notes/${id}`)
  //     .then(response => {
  //       const updatedNotes = { ...notes };
  //       delete updatedNotes[id]; // Elimina la nota del objeto por su id
  //       setNotes(updatedNotes);
  //     })
  //     .catch(err => console.log(err));
  // }

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const note = notes[dateString];
      return (
        <div className={`note-container ${note?.crossed ? 'crossed' : ''}`}>
          {note?.note && <span className="note">{note.note}</span>}
        </div>
      );
    }
  };

  const isPastDate = (date) => {
    return date < new Date().setHours(0, 0, 0, 0);
  };

  return (
    <>
      <div className="calendar-container">
        <h1 className="calendar-header">Calendario</h1>
        <Calendar
          onChange={onChange}
          value={date}
          tileContent={getTileContent}
          tileDisabled={({ date }) => isPastDate(date)}
        />
        <input
          type="text"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Agregar nota"
        />
        <div className="input-container">
          <button onClick={addNote} className="add-note-button">Agregar</button>
          {/* <button onClick={() => deleteNotes(date.toDateString())} className="delete">Eliminar</button> */}
          <NavLink to="/notas"> <button className='ver-notas'> Ver Notas </button></NavLink>
        </div>
      </div>
    </>
  );
}

export default Calendario;