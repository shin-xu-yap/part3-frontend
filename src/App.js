import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
      .catch(err => console.log(err))
  }
  useEffect(hook, [])
  
  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='success'>
        {message}
      </div>
    )
  }

  const Notification2 = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const existingPerson = persons.find((person)=> person.name === newName)
    if(existingPerson){
      console.log(existingPerson.id);
      let text = newName + " is already added to phonebook, replace the old number with a new one?";
      if(window.confirm(text) === true){
        personService
        .update(existingPerson.id, personObject)
        .then(response =>{
          const currentIndex = persons.findIndex((person) => person.name === newName)
          const updatedPerson = {...persons[currentIndex], number: newNumber}
          const newPersons = [
            ...persons.slice(0, currentIndex),
            updatedPerson,
            ...persons.slice(currentIndex+1)
          ]
          setPersons(newPersons)
          setNewName('');
          setNewNumber('');
          setSuccessMessage(
            `Updated ${newName}'s phone number`
          )
          setTimeout(() =>{
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() =>{
            setErrorMessage(null)
          }, 5000)
        })
      }
    }else{
      personService
      .create(personObject)  
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `Added ${newName}`
        )
        setTimeout(() =>{
          setSuccessMessage(null)
        }, 5000)
      })
      .catch(err => {
        // console.log(err.response.data.err)
        setErrorMessage(
          err.response.data
        )
        setTimeout(() =>{
          setErrorMessage(null)
        }, 5000)
      })
    }
  }

  const deletePerson = (id, name, e) => {
    const text = "Delete " + name + "?";
    if (window.confirm(text)) {
      e.preventDefault()
      personService
        .remove(id)
        .then(() => {
          setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting person:", error);
        });
    }
  };
  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    event.preventDefault()
    var updatedList = [...persons];
    updatedList = updatedList.filter((person) => {
        return person.name.toLowerCase().indexOf(newFilter.toLowerCase()) !== -1;
    });
    setPersons(updatedList);
    setNewFilter('')
  }

  const handleChange = (event) => {
    setNewFilter(event.target.value)
  }

  
  return (
    <div>
      <Notification message={successMessage} />
      <Notification2 message={errorMessage} />
      <h2>Phonebook</h2>
      <form onSubmit={handleFilter}>
        <div>
          <p>filter shown with</p>
          <input
            value={newFilter}
            onChange={handleChange}
          />
        </div>
      </form>
      
      <form onSubmit={addName}>
        <h2>add a new</h2>
        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div> 
        {persons.map((person, index) => {
          return(
            <div key={index}>
              {person.name} {person.number}
              <button 
                type='submit'
                onClick={(e) => deletePerson(person.id,person.name,e)}
              >Delete
              </button>
            </div> 
          )
          }) 
        } 
      </div> 
    </div>
  )
}

export default App