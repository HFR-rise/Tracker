import React, { useState, useEffect } from 'react';
import API from '../network/API';
import LeftPanel from '../components/LeftPanel/LeftPanel';
import TopPanel from '../components/TopPanel/TopPanel';
import { Image } from 'react-bootstrap';

const ExcelReader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.authFetch({ path: '/employee/info' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  const userPhotos = {
    'fkryuchkova': process.env.PUBLIC_URL + '/images/table1.png',
    'spodkorytov': process.env.PUBLIC_URL + '/images/table2.png',
    'iivanov': process.env.PUBLIC_URL + '/images/table3.png',
    'apolezhaeva': process.env.PUBLIC_URL + '/images/table4.png',
    'salakin': process.env.PUBLIC_URL + '/images/table1.png',
    'agrents': process.env.PUBLIC_URL + '/images/table6.png',
    'kmarkovskikh': process.env.PUBLIC_URL + '/images/table7.png',
    'inesterenko': process.env.PUBLIC_URL + '/images/table3.png',
    'dnugumanova': process.env.PUBLIC_URL + '/images/table9.png',
    'otokmakova': process.env.PUBLIC_URL + '/images/table1.png',
    'vgilyazov': process.env.PUBLIC_URL + '/images/table1.png',
    'ntrifonov': process.env.PUBLIC_URL + '/images/table11.png',
    'sshepovalova': process.env.PUBLIC_URL + '/images/table1.png',
    'aafanasev': process.env.PUBLIC_URL + '/images/table13.png',
    'izamyatina': process.env.PUBLIC_URL + '/images/table14.png',
    'akildyaev': process.env.PUBLIC_URL + '/images/table15.png',
    'ikildyaev': process.env.PUBLIC_URL + '/images/table16.png',
    'ymorozova': process.env.PUBLIC_URL + '/images/table17.png',
    'spodkorytov1': process.env.PUBLIC_URL + '/images/table18.png',
    'nsnetkov': process.env.PUBLIC_URL + '/images/table19.png',
  };

  const userPhoto = userPhotos[user.id] || null;

  return (
    <div className="page-container" style={{ display: 'flex', height: '100vh' }}>
      <LeftPanel highlight="excel" />
      <div className="content-container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TopPanel title="Расписание" profpic={user.photo_link} username={user.name} />
        <div
          className="image-wrapper"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            backgroundColor: 'white',
          }}
        >
          {userPhoto ? (
            <div
              className="image-container"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image src={userPhoto} alt="User Photo" className="user-photo" />
            </div>
          ) : (
            <p style={{ fontSize: '24px', color: 'grey' }}>Пусто</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelReader;
