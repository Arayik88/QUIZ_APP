import React,{useEffect} from 'react';
import '../../Css/styles.css';
import icon from '../../Image/quiz.png';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Login from './Login';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  BrowserRouter as Router,
  Switch,
  Route} from "react-router-dom";
import { postData } from '../../utils/utils';
import Alert from '../Alert/Alert';


function Register_comp() {

  const Severities={success:"success",error:"error",warning:"warning",info:"info"};
  const [open, setOpen] = React.useState(false);
  const [severity,Setseverity]=React.useState("");
  const [message,Setmessage]=React.useState("");
  const [state, Setstate] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    Confirmpassword:""
  });
  const [loading, setLoading] = React.useState(false);
  const [ValidationState,SetValidationState]=React.useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const HandleRegister = async () => {
    
    const  pattern=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let x=[];
    let regex=RegExp(pattern);
    //check for email
    if(!(regex.test(state.email)))
    {
       
      SetValidationState(["Wrong Email Address"])
      return;
    }
    //check for password
    else
    {   //check if passwords match
      if(state.Confirmpassword!=state.password)
    {  
      
      SetValidationState(["Password Does not match"])
      return;
    }
    //check for password validity
       else{
         //check for length
         
         if(state.password.length<=8)
         {  
         
           x.push("Length is less than 8 character")
           

         }
         if(!(/\d/.test(state.password)))
         {  
           
           x.push("Does not contain a digit");
           

         }
        
         if(state.password==state.password.toLowerCase()){
            x.push("Does not contain an uppercase letter")
         }
        
         if(!(/[!@#$%^&*(),.?":{}|<>]/.test(state.password)))
         { 
           x.push("Does not contain a special character")

         }
         
         SetValidationState(x);
         
         
       }
    }
    
    if(x.length==0)
    { 
    
    setLoading(true);
    let response = await postData("http://localhost:8090/api/auth/register", state)

    if (response.status == "200") {
      setLoading(false);
      Setseverity(Severities.success)
      Setmessage(" Registration was successfull,please check your email for the confirmation link");
    
      setOpen(true);
    }
    else {
      setLoading(false);
      Setseverity(Severities.info)
      Setmessage("Something went wrong please try again");
      
      setOpen(true);
    }
  }
  }
  const HandleBack = () => {
    window.location.href = '/'
  }

  useEffect(() => {document.body.style.overflow="hidden" }, []);
  return (
    <div>
     
    <div className="register-main">
    {loading && <LinearProgress></LinearProgress>}
    
      <img  width='50px' src={icon}></img>
      <h2 style={{ color: "#1976d2", textDecoration: "underline" }}>Register</h2>
      <div style={{marginBottom:10}}>
      <TextField style={{marginBottom:10}} onChange={(e) => { Setstate({ ...state, firstName: e.target.value }) }} style={{ backgroundColor: 'whitesmoke' }} label="Name" variant="outlined"></TextField>
      </div>
      <div style={{marginBottom:10}}>
      <TextField style={{marginBottom:10}} onChange={(e) => { Setstate({ ...state, lastName: e.target.value }) }} style={{ backgroundColor: 'whitesmoke' }} label="Surname" variant="outlined"></TextField>
      </div>
     <div style={{marginBottom:10}}>
      <TextField style={{marginBottom:10}} onChange={(e) => { Setstate({ ...state, email: e.target.value }) }} style={{ backgroundColor: 'whitesmoke' }}  label="email" variant="outlined" type="email" required></TextField>
      </div>
     <div style={{marginBottom:10}}>
      <TextField style={{marginBottom:10}} onChange={(e) => { Setstate({ ...state, password: e.target.value }) }} style={{ backgroundColor: 'whitesmoke' }} required label="password" type='password' variant="outlined"></TextField>
      </div>
      <div style={{marginBottom:10}}>
      
      <TextField style={{marginBottom:10}} onChange={(e) => { Setstate({ ...state, Confirmpassword: e.target.value }) }} style={{ backgroundColor: 'whitesmoke' }} required label="Confirm password" type='password' variant="outlined"></TextField>
      </div>
      <Button style={{ marginRight: '10px' }} onClick={HandleBack} color='primary' variant='contained'>Go Back</Button>

      <Button
        variant="contained"
        color="primary"

        disabled={loading}
        onClick={()=>{HandleRegister()}}
      >
        Register
        </Button>
        <div id='Validation' style={{marginTop:20}} >{ValidationState.map((x)=>{return <div style={{color:"Red",marginBottom:10}}>{x}</div>})}</div>
        <Alert open={open} message={message} handleClose={handleClose} severity={severity}></Alert>
        


    </div>
    </div>
  )

}
function Register() {
  return (
    <Router>

      <div>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register_comp />
          </Route>
        </Switch>
      </div>

    </Router>

  );

}
export default Register;