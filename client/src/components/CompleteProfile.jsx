import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
  const [bs, setBs] = useState('');

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone is required';
    if (!street) newErrors.street = 'Street is required';
    if (!suite) newErrors.suite = 'Suite is required';
    if (!city) newErrors.city = 'City is required';
    if (!zipcode) newErrors.zipcode = 'Zipcode is required';
    if (!lat) newErrors.lat = 'Latitude is required';
    if (!lng) newErrors.lng = 'Longitude is required';
    if (!companyName) newErrors.companyName = 'Company Name is required';
    if (!catchPhrase) newErrors.catchPhrase = 'Catch Phrase is required';
    if (!bs) newErrors.bs = 'Business Strategy is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = JSON.parse(localStorage.getItem('newUser'));

    const updatedUser = {
      ...newUser,
      name: name,
      email: email,
      address: {
        street: street,
        suite: suite,
        city: city,
        zipcode: zipcode,
        geo: {
          lat: lat,
          lng: lng,
        },
      },
      phone: phone,
      company: {
        name: companyName,
        catchPhrase: catchPhrase,
        bs: bs,
      },
    };

    try {
      const response = await fetch(`http://localhost:3000/users/${newUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.removeItem('newUser');
      navigate('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleCompleteProfile} className="complete-profile-form">
        <div className="form-section">
          <fieldset>
            <legend>Personal Information</legend>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
            {errors.name && <div className="error">{errors.name}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </fieldset>
        </div>
        <div className="form-section">
          <fieldset>
            <legend>Address Information</legend>
            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="form-input"
            />
            {errors.street && <div className="error">{errors.street}</div>}
            <input
              type="text"
              placeholder="Suite"
              value={suite}
              onChange={(e) => setSuite(e.target.value)}
              className="form-input"
            />
            {errors.suite && <div className="error">{errors.suite}</div>}
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-input"
            />
            {errors.city && <div className="error">{errors.city}</div>}
            <input
              type="text"
              placeholder="Zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="form-input"
            />
            {errors.zipcode && <div className="error">{errors.zipcode}</div>}
            <input
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="form-input"
            />
            {errors.lat && <div className="error">{errors.lat}</div>}
            <input
              type="text"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="form-input"
            />
            {errors.lng && <div className="error">{errors.lng}</div>}
          </fieldset>
        </div>
        <div className="form-section">
          <fieldset>
            <legend>Company Information</legend>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="form-input"
            />
            {errors.companyName && <div className="error">{errors.companyName}</div>}
            <input
              type="text"
              placeholder="Catch Phrase"
              value={catchPhrase}
              onChange={(e) => setCatchPhrase(e.target.value)}
              className="form-input"
            />
            {errors.catchPhrase && <div className="error">{errors.catchPhrase}</div>}
            <input
              type="text"
              placeholder="Business Strategy"
              value={bs}
              onChange={(e) => setBs(e.target.value)}
              className="form-input"
            />
            {errors.bs && <div className="error">{errors.bs}</div>}
          </fieldset>
        </div>
        <div className="button-container">
          <button type="submit" className="submit-button">Complete Profile</button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
