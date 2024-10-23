import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/@coreui/coreui-pro/dist/css/coreui.css";
import { Form, Button, Container, Row, Col, Alert, Card, Navbar, ListGroup, Dropdown , NavItem, NavLink, Nav, InputGroup, ButtonGroup   } from 'react-bootstrap';
import { CDatePicker } from '@coreui/react-pro'

const NoPage = () => {
  return (
    <>
      <div className="fullpage-center">
        <Alert key="danger" variant="danger" className="text-center">
          <h2>404 Error</h2>
          <p>The page you are looking for was not found.</p>
          <p>
            Click <Alert.Link href="/">here</Alert.Link> to go back to the home page.
          </p>
        </Alert>
      </div>
    </>
  );
};

const baseUrlUser = `${window.location.protocol}//${window.location.hostname}:4000/api/user`;
const baseUrlPosts = `${window.location.protocol}//${window.location.hostname}:4000/api/posts`;
const baseUrlPost = `${window.location.protocol}//${window.location.hostname}:4000/api/post`;
const baseUrlPostsSubmissions = `${window.location.protocol}//${window.location.hostname}:4000/api/posts/submissions`;
const baseUrlCategories = `${window.location.protocol}//${window.location.hostname}:4000/api/categories`;
const baseUrlCreatePost = `${window.location.protocol}//${window.location.hostname}:4000/api/create-post`;
const baseUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/login`;
const baseUrlLogout = `${window.location.protocol}//${window.location.hostname}:4000/api/logout`;
const baseUrlCategoryCreate = `${window.location.protocol}//${window.location.hostname}:4000/api/create-category`;
const baseUrlCategory = `${window.location.protocol}//${window.location.hostname}:4000/api/category`;
const baseUrlSearchUsers = `${window.location.protocol}//${window.location.hostname}:4000/api/search-users`;
function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const usernamePattern = /^[A-Za-z0-9_]{2,24}$/;
    if (email === '' || password === '' || username === '') {
      setError('Email, username and password fields are required.');
    } else if (!usernamePattern.test(username)) {
      setError("Username can only contain Latin letters, numbers, and underscores, and must be between 2 and 24 characters long.");
    } else if (!pattern.test(password)) {
      setError("Password must be at least 8 characters long, contain at least one number, and have at least one uppercase letter.");
    } else if (password !== repeatPassword) {
      setError("Repeat password field must be same as password field.");
    } else {
      setError('');
      setIsLoading(true);
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/sign-up`;
      const data = {
        username: username,
        password: password,
        email: email
      };

      fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.error != null) {
          setIsLoading(false);
          setError(data.error);
          return;
        }
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      })
      .catch(error => {
        setError('There has been a problem with fetch operation: ' + error.toString());
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      {isLoading && 
        <div className='fullpage-center' style={{ position: "fixed", zIndex: 10, top: "0px", left: "0px", backgroundColor: "rgba(12, 11, 12, 0.74)" }}>
          <Spinner></Spinner>
        </div>
      }
      <Container className="mt-5 dark-theme">
        <Row className="justify-content-md-center">
          <Col md={4} className="login-block">
            <h2 className="text-center">Sign-Up</h2>

            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} data-bs-theme="dark">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicText">
                <Form.Label>Username</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">👤</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="john_doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formBasicRepeatPassword" className="mt-3">
                <Form.Label>Repeat Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4 w-100">
                Sign Up
              </Button>
            </Form>

            <div className="mt-3 text-center">
              <a href="/login">Login!</a>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}



function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((email === '' && username === '') || password === '') {
      setError('Both fields are required.');
    } else {
      setError('');
      setIsLoading(true);
      
      const data = {
        username: username,
        password: password,
        email: email
      };

      fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          if (data.error != null) {
            setIsLoading(false);
            setError(data.error);
            return;
          }
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        })
        .catch(error => {
          setError('There has been a problem with fetch operation: ' + error.toString());
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      {isLoading && 
        <div className='fullpage-center' style={{ position: "fixed", zIndex: 10, top: "0px", left: "0px", backgroundColor: "rgba(12, 11, 12, 0.74)" }}>
          <Spinner></Spinner>
        </div>
      }
      <Container className="mt-5 dark-theme">
        <Row className="justify-content-md-center">
          <Col md={4} className="login-block">
            <h2 className="text-center">Login</h2>
            <p className='text-center'>Choose to login with username or email.</p>
            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} data-bs-theme="dark">
              {email.length === 0 && (
                <Form.Group controlId="formBasicText">
                  <Form.Label>Username</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">👤&#xFE0E;</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="john_doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </Form.Group>
              )}

              {username.length === 0 && (
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </Form.Group>
              )}

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">&#xFE0E;🔒&#xFE0E;</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4 w-100">
                Login
              </Button>
            </Form>

            <div className="mt-3 text-center">
              <a href="/sign-up">Sign Up!</a>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const Spinner = () => {
  return (<>
    <div className="spinner-container">
      <div></div>
    </div></>
  );
};

const Login = () => {
  return <>
    <div className='fullpage-center'>
      <LoginForm></LoginForm>
    </div>
  </>
};

const SignUp = () => {
  return <>
    <div className='fullpage-center'>
      <SignUpForm></SignUpForm>
    </div>
  </>
};
function MainNavbar(props){
    function logout(){
      fetch(baseUrlLogout, {
        headers: {
          'Authorization': props.token
        }}).then((res)=>{return res.json();}).then(data=>{
          localStorage.setItem("token","")
          window.location.reload()
        })
    }
    return (
      <Navbar className="bg-body-tertiary dark-theme" data-bs-theme="dark" style={{width:"100%"}}>
        <Container>
          <Navbar.Brand href="/">Events-App</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-around">
          <div className='nav-links'>
            <Nav.Link onClick={()=>{logout()}} href='javascript:void(0)' style={{"color":"white","textDecoration":"underline"}} >Logout</Nav.Link>
          </div>
          <Dropdown as={NavItem} className='nav-dropdown'>
            <Dropdown.Toggle as={NavLink} data-bs-theme="dark" style={{"color":"white"}} >Menu</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>{logout()}} href='javascript:void(0)'>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          </Navbar.Collapse>
          <Navbar.Text>
              Welcome, <a href="/profile">{props.username}</a>
            </Navbar.Text>
        </Container>
      </Navbar>
    );
  
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function NewPostForm(props) {
  const [editingMode, setEditingMode] = useState(Boolean(props.editingMode))
  const [name, setName] = useState(editingMode ? props.postData?.name || '' : '');
  const [location, setLocation] = useState(editingMode ? props.postData?.location || '' : '');
  const [time, setTime] = useState(editingMode ? props.postData?.happening_at * 1000 || + new Date() : + new Date());
  const [category, setCategory] = useState(editingMode ? props.postData?.category_id || -1 : -1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [fieldSize, setFieldSize] = useState(!editingMode ? "380px" : "360px");
  const supportedFormats = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
  console.log(category)
  async function handleSubmit(e){
    e.preventDefault();
    setError("")
    setSubmitDisabled(true)
    if(name == "" || location == "" || time == "" || category == -1){
      setError("Every field except file upload is required.")
      setSubmitDisabled(false)
      return
    }
    if(selectedFile && !supportedFormats.includes(selectedFile.type)){
      setError("This file format is not supported.")
      setSubmitDisabled(false)
      return
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds the 10MB limit.");
      setSubmitDisabled(false)
      return;
    }

    if(time < +new Date()){
      setError("Date cannot be set into past.");
      setSubmitDisabled(false)
      return;
    }

    const formData = new FormData();
   

    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    
    formData.append("name", name);
    formData.append("location", location);
    formData.append("time", time / 1000);
    formData.append("category", category);
    try {
      fetch((editingMode ? baseUrlPost + "/"+ props?.postData.id || 0 : baseUrlCreatePost), {
        headers: {
          'Authorization': props.token
        },
        method: editingMode ? "PUT" : "POST",
        body: formData,
      }).then(response=>{
        return response.json();
      }).then(data=>{
        if(data.error != null){
          setError(data.error)
          setSubmitDisabled(false)
        }else{
          setSuccess(data.message)
          setSubmitDisabled(false)
          if(!editingMode){
          setName("")
          setLocation("")
          setSelectedFile(null)
          setCategory(null)
          }else{
            props.setCategory_name(data.data.category_name)
            props.setName(data.data.name)
            props.setLocation(data.data.location)
            props.setHapenning_at(data.data.happening_at)
            props.setImage_url(data.data.image_url)
          }
        }
      })
    } catch (error) {
      setError('There has been a problem with fetch operation: ' + error.toString());
      setSubmitDisabled(false)
    }
  };
  
  return (<>
    <Container className="mt-3">
      <Row className="justify-content-md-center" >
        <Col md={4} className="login-block" style={(!editingMode ? { width: "800px" } : {width: "100%", outline:"none"})}>
          <h3 className='text-center'>{!editingMode ? "Submit new event" : "Edit event post" }</h3>
          <Form onSubmit={handleSubmit} style={{ "display": "flex", "flexWrap": "wrap", "justifyContent": "space-around" }}>
            <div style={{ "width": fieldSize }}>
              <Form.Label>Name</Form.Label>
              <InputGroup data-bs-theme="dark" className="mb-3" >
                <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M420-160v-520H200v-120h560v120H540v520H420Z" /></svg></InputGroup.Text>
                <Form.Control
                  id='create-new-name'
                  placeholder="Name"
                  aria-label="Name"
                  aria-describedby="basic-addon1"
                  onInput={(e) => { setName(e.target.value) }}
                  value={name}
                />
              </InputGroup>
            </div>
            <div style={{ "width": fieldSize }}>
              <Form.Label>Location</Form.Label>
              <InputGroup data-bs-theme="dark" className="mb-3" >
                <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" /></svg></InputGroup.Text>
                <Form.Control
                  placeholder="Location"
                  aria-label="Location"
                  aria-describedby="basic-addon1"
                  onInput={(e) => { setLocation(e.target.value) }}
                  value={location}
                />
              </InputGroup>
            </div>
            <div style={{ "width": fieldSize }}>
              <Form.Label>Date and time</Form.Label>
              <CDatePicker onDateChange={(e) => { setTime(+e) }} date={new Date(time).toLocaleString("en-us").replace(",","")} timepicker />
            </div>
            <div style={{ "width": fieldSize }}>
              <Form.Label>Category</Form.Label>
              <InputGroup data-bs-theme="dark" className="mb-3" >
              <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/></svg></InputGroup.Text>
              <Form.Select onInput={(e) => {setCategory(e.target.value) }} value={category} aria-label="Default select example">
                <option value={-1}>Select category</option>
                {props.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select></InputGroup>
            </div>
            <div style={{ "width": fieldSize }}>
              <Form.Label>Cover image</Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control id="upld-file" type="file" onInput={(e)=>{setSelectedFile(e.target.files[0]);}} />
              </Form.Group></div>
              
              <div className='w-100'></div>
              {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                {success}
              </Alert>
            )}
            <div className='w-100' style={{"height":"5px"}}></div>
            <Button variant="primary" type="submit" className='mb-2' disabled={submitDisabled} >Submit</Button>
          </Form></Col>
      </Row>
    </Container>
  </>)
}

function CategoriesForm(props) {
  const [name, setName] = useState("")
  const [isLockedSubmit, setIsLockedSubmit] = useState(false)
  const [isLockedDelete, setIsLockedDelete] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState('');
  const [successSubmit, setSuccessSubmit] = useState('');
  const [errorDelete, setErrorDelete] = useState('');
  const [successDelete, setSuccessDelete] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(-1)
  const [selectedCategoryName, setSelectedCategoryName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  function handleSubmit(e){
    e.preventDefault();
    setIsLockedSubmit(true)
    fetch(baseUrlCategoryCreate,{
      headers:{
        Authorization: props.token,
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({name:name})
    }).then(res=>{return res.json();}).then(data=>{
      if(data.error != null){
        setErrorSubmit(data.error)
      }else{
        setSuccessSubmit(data.message)
      }
      setIsLockedSubmit(false)
      setName("")
      fetch(baseUrlCategories, { headers:{
        Authorization: props.token,
        'Content-Type': 'application/json'
       }})
      .then(response => response.json())
        .then(data =>{
          props.setCategoriesData(data.data)
        })
    })
  }
  function handleDelete(e){
    e.preventDefault()
    setIsDeleting(true)
  }
  return (<>
  {(isDeleting && 
      <div className='fullpage-center' style={{top:"0px",left:"0px",position:"fixed",fixed:"10",backgroundColor:"rgba(25, 25, 27,50%)", zIndex:10, width:"100%"}}>
         <Card style={{ width: '400px', maxWidth:"100dvw" }}>
          <Card.Body>
            <Card.Title>Delete category?</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Are you sure you want to delete category "{selectedCategoryName}" ?</Card.Subtitle>
            <Card.Text>
              Deleting event category cannot be undone. Are you sure you want to do this?
            </Card.Text>
            <div className="btn-group" role="group">
            <Button variant='danger' onClick={(e)=>{
              fetch(baseUrlCategory + "/"+selectedCategory,{headers:{
                "Authorization": props.token
              }, method: "DELETE"}).then(res=>{return res.json();}).then(data=>{
                  setIsLockedDelete(false)
                  setIsDeleting(false)
                  if(data.error != null){
                    setErrorDelete(data.error)
                  }else{
                    setSuccessDelete(data.message)
                  }
                  fetch(baseUrlCategories, { headers:{
                    Authorization: props.token,
                    'Content-Type': 'application/json'
                   }})
                  .then(response => response.json())
                    .then(data =>{
                      props.setCategoriesData(data.data)
                    })
              })  
            }} style={{color:"white"}}>Yes</Button>
            <Button variant='primary' onClick={(e)=>{setIsDeleting(!isDeleting);setIsLockedDelete(false);}} >No, cancel</Button>
            </div>
        </Card.Body>
    </Card>
      </div>
      )}
    <Container className="mt-1 dark-theme" data-bs-theme="dark" >
      <Row className="justify-content-md-center" >
        <Col md={4} className="login-block" style={{ width: "800px", maxWidth: "100%" }}>
          <h3 className='text-center'>Create new category</h3>
          <Form onSubmit={handleSubmit} style={{display:"flex",justifyContent:"center",width:"100%",alignItems:"end"}}>
            
          <div style={{width:"400px"}}>
          <Form.Label>Category</Form.Label>
          <InputGroup >
                <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/></svg></InputGroup.Text>
                <Form.Control
                  id='create-new-name'
                  placeholder="Name"
                  aria-label="Name"
                  aria-describedby="basic-addon1"
                  onInput={(e) => { setName(e.target.value) }}
                  value={name}
                />
            </InputGroup>
            </div>
            <Button type='submit' variant='primary' style={{height:"fit-content"}} disabled={isLockedSubmit}>Submit</Button>
          </Form>
          {errorSubmit && (
              <Alert variant="danger" onClose={() => setErrorSubmit('')} dismissible>
                {errorSubmit}
              </Alert>
            )}
            {successSubmit && (
              <Alert variant="success" onClose={() => setSuccessSubmit('')} dismissible>
                {successSubmit}
              </Alert>
            )}
            <hr></hr>
            <h3 className='text-center'>Delete category</h3>
          <Form onSubmit={handleDelete} style={{display:"flex",justifyContent:"center",width:"100%",alignItems:"end"}}>
          <div style={{width:"400px"}}>
          <Form.Label>Category</Form.Label>
              <InputGroup data-bs-theme="dark" className="" >
              <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/></svg></InputGroup.Text>
              <Form.Select onInput={(e) => {setSelectedCategory(e.target.value);setSelectedCategoryName(e.target.options[e.target.selectedIndex].text)}} value={selectedCategory} aria-label="Default select example">
                <option value="-1">Select category</option>
                {props.categoriesData.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select></InputGroup>
              </div>
              <Button type='submit' variant='danger' style={{height:"fit-content", color:"white"}} disabled={isLockedDelete} onClick={handleDelete}>Delete</Button>
          </Form>
          {errorDelete && (
              <Alert variant="danger" onClose={() => setErrorDelete('')} dismissible>
                {errorDelete}
              </Alert>
            )}
            {successDelete && (
              <Alert variant="success" onClose={() => setSuccessDelete('')} dismissible>
                {successDelete}
              </Alert>
            )}
        </Col>
      </Row>
    </Container>
  </>)
}

function PunishmentsDisplay(props){
  const user = props.user
  const [punishments, setPunishments] = useState([])
  
  return (
    <div className='fullpage-center' style={{ position: "fixed", zIndex: 10, top: "0px", left: "0px", backgroundColor: "rgba(12, 11, 12, 0.74)" }}>
      <Card style={{width:"800px",maxWidth:"100%"}}>
        <h3 className='text-center'>Punishments of {user.username}.</h3>
        {(punishments != null && punishments.length == 0) && <Alert variant='primary'>This user does not have any punishments.</Alert>}
  {punishments.map((punishment)=>
  <>
    <div class="punishments-container">
      <div class="punishment-id"><p>ID: {punishment.id}</p></div>
      <div class="punishment-reason"><p>Reason: {punishment.reason}</p></div>
      <div class="punishment-active"><p>Active: {punishment.active}</p></div>
      <div class="punishment-actions"></div>
      <div class="punishment-by"><p>Made by: {punishment.author_username}</p></div>
      <div class="punishment-created-at"><p>Created at: {new Date(punishment.created_at * 1000).toLocaleString()}</p></div>
      <div class="punishment-expires-at"><p>Expires: {punishment.expires != null ? new Date(punishment.expires * 1000).toLocaleString() : "Never"}</p></div>
    </div>
    <br></br>
    </>)}</Card></div>)
}

function UsersDisplay(props){
  const user = props.user
  const [displayPunishments, setDisplayPunishments] = useState(false)
  return <>
    {displayPunishments && <PunishmentsDisplay user={user}></PunishmentsDisplay>}
    <div class="users-container">
      <div class="users-userid"><p>ID: {user.id}</p></div>
      <div class="users-actions">
        <ButtonGroup>
          <Button variant='warning' style={{color:"white"}}>Mute</Button>
          <Button variant='danger' style={{color:"white"}}>Ban</Button>
          <Button variant='primary'>View punishments</Button>
        </ButtonGroup>
      </div>
      <div class="users-createdat"><p>Created at: {new Date(user.created_at * 1000).toLocaleString()}</p></div>
      <div class="users-lastvisitat"><p>Last visited at: {new Date(user.last_visit_at * 1000).toLocaleString()}</p></div>
      <div class="users-username"><p>Username: {user.username}</p></div>
    </div>
    <br></br>
    </>
}

function UsersForm(props){
  const [usersData, setUsersData]=useState(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [error, setError] = useState('');
  function searchUsers(query){
    fetch(baseUrlSearchUsers + "/" + encodeURIComponent(query), {headers:{Authorization: props.token}}).then(res=>{return res.json()}).then(data=>{
      if(data.error != null){
        setError(data.error)
      }else{
        setUsersData(data.data)
      }
      setIsLoadingUsers(false)
    })
  }
  return (<>
    <Container className="mt-1 dark-theme" data-bs-theme="dark" >
      <Row className="justify-content-md-center" >
        <Col md={4} className="login-block" style={{ width: "800px", maxWidth: "100%" }}>
          <p className='text-center'>Enter user ID or username to start searching.</p>
            <div className='d-flex justify-content-center'>
            <div style={{width:"400px"}}> 
            <Form.Label>Username or UserID</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg></InputGroup.Text>
              <Form.Control
                placeholder="Username/ID"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={searchQuery}
                onChange={(e)=>{setSearchQuery(e.target.value)}}
                onInput={(e)=>{
                  setSearchQuery(e.target.value);
                  setIsLoadingUsers(true);
                  setUsersData([]);
                  clearTimeout(searchTimeout);
                  setSearchTimeout(setTimeout(()=>{searchUsers(e.target.value)}, 1000))
                }}
              />
            </InputGroup>
            </div>
          </div>
          {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
              )}
          <div className='users-display'>
            { isLoadingUsers &&
              <div className='d-flex justify-content-center'><Spinner></Spinner></div>
            }
            {usersData != null && usersData.map((user)=><UsersDisplay user={user}></UsersDisplay>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  </>)
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [submissionsMode, setSubmissionsMode] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [categoriesMode, setCategoriesMode] = useState(false)
  const [usersMode, setUsersMode] = useState(false)
  const headers = { 'Authorization': token };
  function fetchPosts(callback){
    fetch(baseUrlPosts, { headers })
    .then(response => response.json())
      .then(callback)
  }
  function fetchSubmissions(callback){
    fetch(baseUrlPostsSubmissions, { headers })
    .then(response => response.json())
      .then(callback)
  }

  useEffect(()=>{
    if(token == null){
      window.location.href = "/login"
    }else{
      fetch(baseUrlUser, { headers })
    .then(response => response.json())
    .then(data =>{
      if(data.data == null){
        window.location.href = "/login"
      }  
      setIsLoading(false)
      setIsLoadingPosts(true)
      setUserData(data.data)
      fetchPosts(data =>{
        setPostsData(data.data)
        setIsLoadingPosts(false)
      })
      fetch(baseUrlCategories, { headers })
    .then(response => response.json())
      .then(data =>{
        setCategoriesData(data.data)
      })  
    });

    
    }

  },[])
  return <>
  <div className='fullpage-center-vertical dark-theme w-100'>
    <MainNavbar token={token} username={userData?.username || "Unknown"}></MainNavbar>
    {((userData != null && Boolean(userData.is_admin)) && <>
      <Form.Check 
      type="switch"
      label="Admin mode"
      value={adminMode}
      onChange={(e)=>{setAdminMode(e.target.checked);if(!e.target.checked){setCategoriesMode(false);setSubmissionsMode(false);}}}
    /></>)}
    {(adminMode && <>
      <Form.Check 
        type="switch"
        label="Show submissions"
        value={submissionsMode}
        onChange={(e)=>{setSubmissionsMode(e.target.checked);
          setPostsData(null)
          setIsLoadingPosts(true)
          if(e.target.checked){
            fetchSubmissions(data =>{
              setPostsData(data.data)
              setIsLoadingPosts(false)
            })
          }else{
            fetchPosts(data =>{
              setPostsData(data.data)
              setIsLoadingPosts(false)
            })
          }
        }}
      />
      <Form.Check 
      type="switch"
      label="Manage categories"
      value={categoriesMode}
      onChange={(e)=>{setCategoriesMode(e.target.checked);}}
      
    /><Form.Check 
    type="switch"
    label="Manage users"
    value={usersMode}
    onChange={(e)=>{setUsersMode(e.target.checked);}}
    
  /></>)}
    
    {(!adminMode ? 
    <NewPostForm categories={categoriesData} token={token}></NewPostForm>
   : <></>)}
   {( adminMode && categoriesMode && <CategoriesForm token={token} setCategoriesData={setCategoriesData} categoriesData={categoriesData}></CategoriesForm>)}
   {( adminMode && usersMode && <UsersForm token={token}></UsersForm>)}
   {( ((!adminMode) || (adminMode && submissionsMode)) &&
    <div className='posts'>
      {(isLoadingPosts && 
        <center>
          <Spinner></Spinner>
        </center>)}
       {(JSON.stringify(postsData) == "[]" && <center>
        <br></br>
        <Alert key="primary" variant="primary">
          There are no events yet, check back another time or create your own.
        </Alert>
       </center>)}
       {(JSON.stringify(postsData) !== "[]" && postsData != null && postsData.length > 0) &&
        postsData.map((post, index) => (
          <PostCard key={index} post={post} userData={userData} token={token} setIsLoading={setIsLoading} fetchPosts={fetchPosts} setPostsData={setPostsData} setIsLoadingPosts={setIsLoadingPosts} fetchSubmissions={fetchSubmissions} submissionsMode={submissionsMode} categoriesData={categoriesData} setCategoriesData={setCategoriesData} />
        ))
      }
    </div>
    )}
  </div>
  {isLoading && (
    <div className='fullpage-center' style={{ position: "fixed", zIndex: 10, top: "0px", left: "0px", backgroundColor: "rgba(12, 11, 12, 0.74)" }}>
      <Spinner></Spinner>
    </div>
  )}
  
  </>;
};

function RenderAsUnicode(props){
  return (
    <span style={{fontFamily:'"Segoe UI Symbol", monospace'}}>{props.emoji}&#8203;</span>
  )
}

const PostCard = ({ post, userData, token, setIsLoading, fetchPosts, setPostsData, setIsLoadingPosts, fetchSubmissions, submissionsMode, categoriesData}) => {
  const {
    id,
    author_id,
    author_username,
    created_at,
    category_id,
  } = post;
  const [name, setName] = useState(post.name)
  const [location, setLocation] = useState(post.location)
  const [happening_at, setHapenning_at] = useState(post.happening_at)
  const [image_url, setImage_url] = useState(post.image_url)
  const [category_name, setCategory_name] = useState(post.category_name)
  const [isDeleted, setIsdeleted] = useState(false);
  const is_approved = (post?.is_approved == null ? true : post.is_approved )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  return <>{!isDeleted && 
    <Card style={{ width: '100%' }} data-bs-theme="dark">
      {(isDeleting && 
      <div className='fullpage-center' style={{top:"0px",left:"0px",position:"fixed",fixed:"10",backgroundColor:"rgba(25, 25, 27,50%)", zIndex:10, width:"100%"}}>
         <Card style={{ width: '400px', maxWidth:"100dvw" }}>
          <Card.Body>
            <Card.Title>Delete event?</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Are you sure you want to delete event "{name}" ?</Card.Subtitle>
            <Card.Text>
              Deleting event post cannot be undone. Are you sure you want to do this?
            </Card.Text>
            <div className="btn-group" role="group">
            <Button variant='danger' onClick={(e)=>{
              setIsLoading(true)
              fetch(baseUrlPost + "/"+id,{headers:{
                "Authorization": token
              }, method: "DELETE"}).then(res=>{return res.json();}).then(data=>{
                  setIsLoading(false)
                  setIsDeleting(false)
                  setIsdeleted(true)
              })  
            }} style={{color:"white"}}>Yes</Button>
            <Button variant='primary' onClick={(e)=>{setIsDeleting(!isDeleting);}} >No, cancel</Button>
            </div>
        </Card.Body>
    </Card>
      </div>
      )}
      <Card.Img variant="top" style={{"height":"20rem","objectFit":"cover"}} src={image_url} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text >
        <svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="#e8eaed"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
         {location}<br></br>
         <svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="#e8eaed"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/></svg>
         {new Date(happening_at * 1000).toLocaleString()} <br></br>
         <svg xmlns="http://www.w3.org/2000/svg" height="1.25rem" viewBox="0 -960 960 960" width="1.25rem" fill="#e8eaed"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z"/></svg>
          {category_name}
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg> {author_username}</ListGroup.Item>
      
        <ListGroup.Item>
        {((author_id == (userData?.id || -1) || (userData?.is_admin || false)) &&<>
          <div className="btn-group" role="group" aria-label="Basic example">
        <Button variant="primary" onClick={(e)=>{setIsEditing(!isEditing);}}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></Button>
        <Button onClick={()=>{setIsDeleting(!isDeleting);}} variant="danger"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></Button>
          {(((userData.is_admin || false) && (!is_approved)) && 
        <Button onClick={()=>{
          fetch(baseUrlPosts + "/approve/"+id,{headers:{
            "Authorization": token
          }}).then(res=>{return res.json();}).then(data=>{
            setIsLoadingPosts(true)
            setIsLoading(false)
            fetchSubmissions(data =>{
              setPostsData(data.data)
              setIsLoadingPosts(false)
            })
          })
        }} variant='success'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m381-240 424-424-57-56-368 367-169-170-57 57 227 226Zm0 113L42-466l169-170 170 170 366-367 172 168-538 538Z"/></svg></Button>
        )}
          </div>
      </>)}
      </ListGroup.Item>
      {(isEditing && 
      <ListGroup.Item>
        <NewPostForm categories={categoriesData} token={token} editingMode={true} postData={post} setCategory_name={setCategory_name} setName={setName} setLocation={setLocation} setHapenning_at={setHapenning_at} setImage_url={setImage_url}></NewPostForm>
      </ListGroup.Item>
      )}
      </ListGroup>
    </Card>
  }</>;
};

document.title = "EventApp"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
