'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/utils/fetch';
import styles from './moderate-joke.module.css';
import { withProtectedPage } from "@/app/hoc/withProtectedPage";

const ModeratorPage = () => {
  const [joke, setJoke] = useState(null);
  const [jokeTypes, setJokeTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [editedJokeContent, setEditedJokeContent] = useState('');
  const [newJokeTypeName, setNewJokeTypeName] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkNoJokeFound, setCheckNoJokeFound] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAddingNewType, setIsAddingNewType] = useState(false);

  const router = useRouter();

  const fetchJokeTypes = async () => {
    const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8001/api/jokes/types`);
    setJokeTypes(data);
  };

  useEffect(() => {
    fetchJokeTypes();
  }, []);

  const fetchJoke = async () => {
    try {
      const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8001/api/jokes/getNewJoke`);
      console.log('fetchJoke', data);
      if (data) {
        setJoke(data);
        setSelectedType(data.typeId);
        setEditedJokeContent(data.content);
        setCheckNoJokeFound(false);
        setHasUnsavedChanges(false);
      } else {
        setJoke(null);
        setSelectedType('');
        setEditedJokeContent('');
        setCheckNoJokeFound(true);
      }
      setApprovalMessage('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching joke:', error);
      setErrorMessage(error.message);  // Corrected this line
    }
  };
  

  const handleApprove = async () => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8001/api/jokes/submitToDeliverJokes/${joke._id}`, 'PUT', null);
      setApprovalMessage('Joke has been approved and submitted to the Deliver Jokes!');
      setErrorMessage('');
      setJoke(null);
    } catch (error) {
      console.error('Error approving joke:', error);
      setErrorMessage('There was an error approving the joke. Please try again.');
    }
  };

  const handleReject = async () => {
    try {
      await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8001/api/jokes/reject/${joke._id}`, 'DELETE', null);
      setErrorMessage('Joke has been rejected!');
      setJoke(null);
    } catch (error) {
      console.error('Error rejecting joke:', error);
      setErrorMessage('There was an error rejecting the joke. Please try again.');
    }
  };

  const handleEditJokeContent = (event) => {
    setEditedJokeContent(event.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSaveEditedJoke = async () => {
    const payload = { content: editedJokeContent, typeId: selectedType };
    try {
      const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:8001/api/jokes/update/${joke._id}`, 'PUT', payload);
      setApprovalMessage(data.message);
      setErrorMessage('');
      setHasUnsavedChanges(false);
      fetchJoke();
    } catch (error) {
      console.error('Error updating joke content:', error);
      setErrorMessage('There was an error updating the joke. Please try again.');
    }
  };

  const handleSetNewJokeType = async () => {
    setApprovalMessage('');
    if (!newJokeTypeName) {
      setErrorMessage('Please enter a name for the new joke type.');
      return;
    }
  
    try {
      const newType = await fetchWithAuth(`${process.env.NEXT_PUBLIC_DELIVER_JOKES_API_URL}:3333/jokes/newJokeType`, 'POST', { name: newJokeTypeName });
      
      console.log('response:', newType);
      setJokeTypes((prevTypes) => [...prevTypes, newType]);
      setSelectedType(newType.id);
      setNewJokeTypeName('');
      setIsAddingNewType(false);
      setErrorMessage('');
      setHasUnsavedChanges(true);
      setApprovalMessage('New joke type added successfully!')
    } catch (error) {
      console.log('Error adding new joke type: oooooooooo', error);
      setErrorMessage('error.message');
    }
  };
  
  useEffect(()=>{
    setApprovalMessage('')
  },[errorMessage])

  useEffect(()=>{
    setErrorMessage('')
  },[approvalMessage])

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setHasUnsavedChanges(true);
  };

  const handleNewTypeNameChange = (event) => {
    setNewJokeTypeName(event.target.value);
  };


  return (
    <div className={styles.container}>
            {JSON.stringify(process.env.DELIVER_JOKES_API_URL)}
      <h1 className={styles.title}>Moderator Dashboard</h1>
      <div className={styles.topPanel}>
        <button className={styles.button} onClick={fetchJoke}>View Next Joke</button>
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        {approvalMessage && <div className={styles.successMessage}>{approvalMessage}</div>}

      </div>
      {joke ? (
        <div>
          <div className={styles.jokeContent}>
            <p><strong>Joke:</strong></p>
            <textarea
              className={styles.textarea}
              rows="4"
              cols="50"
              value={editedJokeContent}
              onChange={handleEditJokeContent}
            ></textarea>
          </div>

          {!isAddingNewType ? (
            <div className={styles.jokeType}>
              <label htmlFor="jokeType">Joke Type: </label>
              <select
                id="jokeType"
                value={selectedType}
                onChange={handleTypeChange}
                className={styles.select}
              >
                {jokeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <button
                className={styles.addNewJokeButton}
                onClick={() => setIsAddingNewType(true)}
              >
                Add New Joke Type
              </button>
            
            </div>
          ) : (
            <div className={styles.newJokeType}>
              <label htmlFor="newJokeType">New Joke Type:</label>
              <input
                id="newJokeType"
                type="text"
                value={newJokeTypeName}
                onChange={handleNewTypeNameChange}
                className={styles.inputField}
              />
              <button
                className={styles.setNewJokeButton}
                onClick={handleSetNewJokeType}
              >
                Set New Joke Type
              </button>
              <button
              
                onClick={() => setIsAddingNewType(false)}
              >
              Cancel
              </button>
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.actionButtonSave}
              onClick={handleSaveEditedJoke}
              disabled={!hasUnsavedChanges}
            >
              Save Joke
            </button>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.actionButtonApprove}
              onClick={handleApprove}
              disabled={hasUnsavedChanges}
            >
              Approve and Submit to the Deliver Jokes
            </button>
            <button
              className={styles.actionButtonReject}
              onClick={handleReject}
              disabled={hasUnsavedChanges}
            >
              Reject and Delete
            </button>
          </div>
        </div>
      ) : (
        checkNoJokeFound && <div className={styles.noJokeMessage}>There are currently no jokes pending moderation. Check back later!</div>
      )}
    </div>
  );
};

export default withProtectedPage(ModeratorPage);
