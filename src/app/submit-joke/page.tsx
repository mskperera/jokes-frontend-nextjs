"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import styles from "./submit-joke.module.css";

const SubmitJokePage = () => {
  const [jokeText, setJokeText] = useState('');
  const [jokeType, setJokeType] = useState('');
  const [jokeTypes, setJokeTypes] = useState<JokeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchJokeTypes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8002/api/jokes/types`);
        const types = await response.json();
        setJokeTypes(types);
        setJokeType(types[0]?.id || ''); // Set default type if available
      } catch (error) {
        console.error('Error fetching joke types', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJokeTypes();
  }, []);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8002/api/jokes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: jokeText, typeId: jokeType }),
      });

      if (response.ok) {
        setSuccessMessage('Joke submitted successfully!');
        setJokeText(''); // Reset joke text input
        // router.push('/'); // Redirect to home or success page after submission
      } else {
        console.log('Failed to submit joke');
      }
    } catch (error) {
      console.error('Error submitting joke', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header1}>Submit a Joke</h1>
      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="jokeType">
            Joke Type:
          </label>
          <select
            id="jokeType"
            className={styles.select}
            value={jokeType}
            onChange={(e) => setJokeType(e.target.value)}
          >
            {jokeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="jokeText">
            Joke Text:
          </label>
          <textarea
            id="jokeText"
            className={styles.textarea}
            value={jokeText}
            onChange={(e) => setJokeText(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Joke
        </button>
      </form>
    </div>
  );
};

export default SubmitJokePage;
