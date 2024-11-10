'use client';
import { useEffect, useState } from 'react';
import styles from "./page.module.css";

const DeliverJokePage = () => {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(false);
  const [jokeType, setJokeType] = useState('');
  const [jokeTypes, setJokeTypes] = useState([]);

  useEffect(() => {
    // Fetch available joke types when component mounts
    const fetchJokeTypes = async () => {
      try {
        const response = await fetch('http://43.205.230.104:3333/jokes/types');
        const data = await response.json();
        setJokeTypes(data);
        setJokeType(data[0]?.id || ''); // Set default joke type if available
      } catch (error) {
        console.error('Error fetching joke types', error);
      }
    };

    fetchJokeTypes();
  }, []);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://43.205.230.104:3333/jokes/random?typeId=${jokeType}`);
      const data = await response.json();
      setJoke(data);
    } catch (error) {
      console.error('Error fetching joke', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
 
        <h1 className={styles.title}>Want a laugh?</h1>
         <h3>  Choose a joke type and let’s brighten your day with a perfect joke just for you!</h3>

<div className={styles.headerContainer}>
        <div className={styles.dropdown}>
          <label htmlFor="jokeType">Joke Type: </label>
          <select 
            id="jokeType" 
            value={jokeType} 
            onChange={(e) => setJokeType(e.target.value)}
            className={styles.select}
          >
            {jokeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <button className={styles.button} onClick={fetchJoke}>
          View Joke
        </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          joke && (
            <div className={styles.jokeContainer}>
              <div className={styles.boxFields}>
                {/* <p>Type: </p>
                <p>{joke.typeName}</p> */}
              </div>
              <div className={styles.boxFields}>
              <textarea
              className={styles.textarea}
              rows="4"
              cols="50"
              value={joke.content}
              disabled
            ></textarea>

      

              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DeliverJokePage;
