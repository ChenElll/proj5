import React from 'react';
import { useParams } from 'react-router-dom';

const Albums = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h2> {user.username}'s Albums</h2>
      {/* Add your Albums component logic here */}
    </div>
  );
};

export default Albums;
