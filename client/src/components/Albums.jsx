import React from 'react';
import { useParams } from 'react-router-dom';

const Albums = () => {
  const { userId } = useParams();

  return (
    <div>
      <h2>User {userId}'s Albums</h2>
      {/* Add your Albums component logic here */}
    </div>
  );
};

export default Albums;
