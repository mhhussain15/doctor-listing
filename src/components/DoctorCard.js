import React from 'react';
import './DoctorCard.css';

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-image">
        <img src={doctor.image || 'https://via.placeholder.com/100'} alt={doctor.name} />
      </div>
      <div className="doctor-info">
        <h2 data-testid="doctor-name">{doctor.name}</h2>
        <p data-testid="doctor-specialty">{doctor.speciality.join(', ')}</p>
        <p data-testid="doctor-experience">{doctor.experience} years experience</p>
        <p data-testid="doctor-fee">₹{doctor.fees} Consultation Fee</p>
        <div className="doctor-consult-type">
          {doctor.videoConsult ? <span className="video-consult">Video Consult Available</span> : null}
          {!doctor.videoConsult ? <span className="in-clinic">In-Clinic Only</span> : null}
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;

