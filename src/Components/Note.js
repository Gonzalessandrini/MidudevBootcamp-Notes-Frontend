export const Note= ({id,content,date})=>{
    return (
    <li>      
      <strong><p>{content}</p></strong>
      <time><small>{date}</small></time>
   </li>
    )
  }
