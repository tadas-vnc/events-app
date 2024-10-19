
export default LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e) => {
      e.preventDefault();
      if (email === '' || password === '') {
        setError('Both fields are required.');
      } else {
        setError('');
        setIsLoading(true);
        console.log('Login submitted:', { email, password });
      }
    };
  
    return (<>
    { isLoading && 
    <div className='fullpage-center' style={{position: "fixed", zIndex:10, top: "0px", left: "0px", backgroundColor: "rgba(12, 11, 12, 0.74)"}}>
      <Spinner></Spinner>
    </div>
    }
      <Container className="mt-5">
        <Row className="justify-content-md-center">
          <Col md={4} className="login-block">
            <h2 className="text-center">Login</h2>
  
            {error && (
              <Alert variant="danger" onClose={() => setError('')} dismissible>
                {error}
              </Alert>
            )}
  
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
  
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
      </Container></>
    );
  };
  