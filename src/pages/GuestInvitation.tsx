import React from 'react';
import { useParams } from 'react-router-dom';

export const GuestInvitation: React.FC = () => {
  const { weddingId, subdomain } = useParams<{ weddingId: string; subdomain?: string }>();

  return (
    <div className="guest-invitation">
      <h1>Wedding Invitation</h1>
      <p>Wedding ID: {weddingId}</p>
      {subdomain && <p>Subdomain: {subdomain}</p>}
      
      <div className="invitation-content">
        <div className="hero-section">
          <h2>Anna Daniela & Alan Iván</h2>
          <p className="wedding-date">November 15, 2024</p>
          <p className="quote">"El mejor tipo de amor es el que despierta el alma y nos hace aspirar a más."</p>
        </div>
        
        <div className="ceremony-details">
          <h3>Ceremony Details</h3>
          <p><strong>Date:</strong> Friday, November 15, 2024</p>
          <p><strong>Time:</strong> 4:00 PM</p>
          <p><strong>Location:</strong> Parroquia San Andrés Apóstol</p>
        </div>
        
        <div className="reception-details">
          <h3>Reception Details</h3>
          <p><strong>Time:</strong> 6:30 PM</p>
          <p><strong>Location:</strong> Jardín La Fuente</p>
        </div>
        
        <div className="rsvp-section">
          <h3>RSVP</h3>
          <p>Please confirm your attendance</p>
          <form className="rsvp-form">
            <div className="form-group">
              <label htmlFor="guestName">Your Name</label>
              <input type="text" id="guestName" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="response">Will you attend?</label>
              <select id="response" required>
                <option value="">Please select</option>
                <option value="attending">Yes, I will attend</option>
                <option value="not_attending">No, I cannot attend</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="plusOnes">Number of guests</label>
              <input type="number" id="plusOnes" min="1" max="5" defaultValue="1" />
            </div>
            
            <div className="form-group">
              <label htmlFor="dietary">Dietary restrictions (optional)</label>
              <textarea id="dietary" rows={3}></textarea>
            </div>
            
            <button type="submit" className="btn-primary">Submit RSVP</button>
          </form>
        </div>
      </div>
    </div>
  );
};
