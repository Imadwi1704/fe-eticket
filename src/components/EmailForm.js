'use client'; // <-- Penting agar tidak dirender di server

import React, { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

const EmailForm = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <form onSubmit={handleNewsletterSubmit}>
      <div className="input-group">
        <input
          type="email"
          className="form-control border-0"
          placeholder="Email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '0.85rem',
          }}
        />
        <button
          className="btn btn-light"
          type="submit"
          style={{ height: '40px', width: '40px' }}
        >
          <FiArrowRight size={16} />
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
