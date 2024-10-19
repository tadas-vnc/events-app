import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { Form, Button, Container, Row, Col, Alert, Card, Navbar, ListGroup, Dropdown , NavItem, NavLink, Nav  } from 'react-bootstrap';
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
      <Container className="mt-5">
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
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:4000/api/login`;
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
      <Container className="mt-5">
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
    return (
      <Navbar className="bg-body-tertiary" data-bs-theme="dark" style={{width:"100%"}}>
        <Container>
          <Navbar.Brand href="/">Events-App</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-around">
          <div className='nav-links'>
            <Nav.Link href='javascript:void(0)' style={{"color":"white","textDecoration":"underline"}} >Logout</Nav.Link>
          </div>
          <Dropdown as={NavItem} className='nav-dropdown'>
            <Dropdown.Toggle as={NavLink} data-bs-theme="dark" style={{"color":"white"}} >Menu</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href='javascript:void(0)'>Logout</Dropdown.Item>
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

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [userData, setUserData] = useState({});
  const [postsData, setPostsData] = useState(null);
  useEffect(()=>{
    let token = localStorage.getItem("token")
    if(token == null){
      window.location.href = "/login"
    }else{
      const headers = { 'Authorization': token };
      const baseUrlUser = `${window.location.protocol}//${window.location.hostname}:4000/api/user`;
      const baseUrlPosts = `${window.location.protocol}//${window.location.hostname}:4000/api/posts`;
      fetch(baseUrlUser, { headers })
    .then(response => response.json())
    .then(data =>{
      if(data.data == null){
        window.location.href = "/login"
      }  
      setIsLoading(false)
      setIsLoadingPosts(true)
      setUserData(data.data)
fetch(baseUrlPosts, { headers })
    .then(response => response.json())
    .then(data =>{
      setPostsData(data.data)
      setIsLoadingPosts(false)
    })  
    });
    }

  },[])
  return <>
  <div className='fullpage-center-vertical'>
    <MainNavbar username={userData?.username || "Unknown"}></MainNavbar>
    <div className='posts'>
      {(isLoadingPosts && 
        <center>
          <Spinner></Spinner>
        </center>)}
       {(JSON.stringify(postsData) == "[]" && <center>
        <br></br>
        <Alert key="primary" variant="primary">
          There are no events yet, check back another time or <Alert.Link href="/create">create your own</Alert.Link>.
        </Alert>
       </center>)}
       {((JSON.stringify(postsData) != "[]" &&  postsData != null && postsData.length >0) &&
        <PostCard post={postsData[0]} userData={userData}></PostCard>      
      )}
    </div>
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

const PostCard = ({ post, userData }) => {
  const {
    id,
    author_id,
    author_username,
    location,
    name,
    created_at,
    category_id,
    category_name,
    happening_at,
    image_url
  } = post;



  return (
    <Card style={{ width: '100%' }} data-bs-theme="dark">
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
      </ListGroup>
      <Card.Body>
        {((author_id == (userData?.id || -1) || (userData?.is_admin || false)) &&<>
          <div class="btn-group" role="group" aria-label="Basic example">
        <a href={"/edit/"+id} class="btn btn-primary" role="button" variant="primary"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></a>
        <Button variant="danger"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></Button>
          </div>
      </>)}
      </Card.Body>
    </Card>
  );
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
