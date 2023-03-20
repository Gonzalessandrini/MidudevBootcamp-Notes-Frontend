import './App.css';
import {Note} from './Components/Note'
import Notication from './Components/Notification'
import {useEffect, useState } from 'react';

import noteService from './services/notes'

import loginService from './services/login';


export default function App(props) {
  
  const[notes,setNotes]=useState([])
  const [newNote,setNewNote]= useState('')

  const [loading,setLoading]= useState(false)
  const [showAll, setShowAll] = useState(true)
  const [error,setError]= useState('')

  const [username, setUsername]= useState("")
  const [password, setPassword]= useState("")
  const [user, setUser]= useState(null)

 useEffect(()=>{
  setLoading(true)
  noteService
   .getAll()
   .then(initialNotes => {setNotes(initialNotes)})
    setLoading(false)
   },[])

 useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    noteService.setToken(user.token)
  }
}, [])

const handleLogout= ()=>{
  setUser(null)
  noteService.setToken(user.token)
  window.localStorage.removeItem('loggedNoteAppUser')
}

const handleChange= (event)=>{
    setNewNote(event.target.value)
  }
 
const addNote= (event)=>{
    event.preventDefault()

    const noteToAddToState={
        content: newNote,
        important:Math.random() < 0.5
      }

    const {token}= user
      
    noteService  
    .create(noteToAddToState, {token})
    .then((data)=>{
      setNotes((prevNotes)=> prevNotes.concat(data));
    })
    .catch((error)=>{
      console.error(error);
      setError('La API se rompio')
    })

    setNewNote('');
}

const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password
    })

    window.localStorage.setItem(
      'loggedNoteAppUser', JSON.stringify(user)
    )

    noteService.setToken(user.token)
    await console.log(user)
    await setUser(user)
    setUsername('')
    setPassword('')
  } catch(e) {
    setError('Wrong credentials')
    setTimeout(() => {
      setError(null)
    }, 5000)
  }
}

const renderLoginForm= ()=>{
  return( <form onSubmit={handleLogin}>
    <div>
    <input
    type='text'
    value={username }
    name='Username'
    placeholder='Username'  
    onChange={(event)=> setUsername(event.target.value)}
    />
  
    </div>
  
      <div>
      <input
      type='password'
      value={password}
      name='Password'
      placeholder='Password'  
      onChange={(event)=> setPassword(event.target.value)}
        />
    </div>
  
  <button>Login</button>
  
    </form>)
 
}

const renderCreateNoteForm= ()=> {
  return(
  <div>
 <form onSubmit={addNote} >
  <br></br>
  <p><strong>Escriba su nota:</strong></p>

  <input type='text'
   onChange={handleChange}
    value={newNote}
    placeholder='Write you note content'
  />
  <div>
  <button type='submit'>Crear Nota</button>
  </div>

  <div>
    <button onClick={handleLogout}>Cerrar sesion</button>
  </div>

 </form>
 </div>
 )
}


  return (
    <div>
    <h1>Notes</h1>

    <span style={{color: "red"}}><Notication message={error} /> </span>

    
    {
     user
     ? renderCreateNoteForm()
     : renderLoginForm()
    }

    <br>
    </br>

    <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>   
      
   
    {loading ? "Cargando..." : ""}
    <ol>
        {notes.map(note=> 
        <Note key={note.id} {...note}/>
        )}
    </ol>
    </div>
  )
}

