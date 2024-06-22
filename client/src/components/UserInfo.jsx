import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <h2>User Information</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Website:</strong> {user.website}</p>
      <h3>Address</h3>
      <p><strong>Street:</strong> {user.address.street}</p>
      <p><strong>Suite:</strong> {user.address.suite}</p>
      <p><strong>City:</strong> {user.address.city}</p>
      <p><strong>Zipcode:</strong> {user.address.zipcode}</p>
      <p><strong>Geo:</strong> Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}</p>
      <h3>Company</h3>
      <p><strong>Name:</strong> {user.company.name}</p>
      <p><strong>Catch Phrase:</strong> {user.company.catchPhrase}</p>
      <p><strong>Business Strategy:</strong> {user.company.bs}</p>
    </div>
  );
};

export default UserInfo;
