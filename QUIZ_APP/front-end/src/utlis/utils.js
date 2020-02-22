import {UserContext} from '../Contexts/user';
export async function postData(url = '', data = {}) {
 
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers:{
        "Content-Type":"application/json",
        
      },
     
    
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
  
    return  response; // parses JSON response into native JavaScript objects
  }
  
