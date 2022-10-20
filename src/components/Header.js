import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

const Header = ({user, recentlyLoggedIn}) =>
{

  const [loggedInUser, setLoggedInUser ] = useState(user);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {setLoggedInUser(user)}, [user]); // this is required to use a prop value as an initial value to a state hook

  useEffect(() => {
    if(recentlyLoggedIn == true)
      window.location.reload();
  }, [recentlyLoggedIn])

  useEffect(()=>{
    if (justLoggedOut === true)
      window.location.reload();
  },[justLoggedOut]);

  const logout = (event) => {
    setLoggedInUser('no');
    setJustLoggedOut(true);
    localStorage.setItem("jwttoken", "loggedout");
    event.preventDefault();
  };

  return(
    <Navbar>
    {console.log('user is: ' + loggedInUser)}
      <Navbar.Brand><Link to="/"><span role="img" aria-label="factory">🏭</span></Link></Navbar.Brand>
      {(loggedInUser === 'no' || loggedInUser === "" || loggedInUser === undefined) &&
        <Nav>
          <div className="nav-link">
            <Link to="/">Home</Link>
          </div>
          <div className="nav-link">
            <Link to="/register">Register</Link>
          </div>
          <div className="nav-link">
            <Link to="/login">Login</Link>
          </div>
        </Nav>
      }
      { loggedInUser !== 'no' && loggedInUser !== "" && loggedInUser !== undefined &&
        <Nav>
          {console.log('Konsole log value inside logout is' + loggedInUser)}
          <div className="nav-link" onClick={logout}>Logout {loggedInUser}</div>
        </Nav>
      }
    </Navbar>
)};

export default Header;
