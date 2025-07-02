import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router';


function NavigationBar () {


  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Item className=''> <Link to="/">Home</Link> </Nav.Item>
            <Nav.Item> <Link to="/login">Login</Link> </Nav.Item>
            <Nav.Item> <Link to="/signup">Sign Up</Link> </Nav.Item>
            <div style={{color:"white"}} onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</div>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;