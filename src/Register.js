import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import validator from "validator";
import PasswordStrengthIndicator from "react-password-strength-bar";

const axios = require("axios");

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isEmailValid, setEmailValidity] = useState(false);
  const [doesEmailExistsonDb, setEmailExistenceOnDb] = useState(false);
  const [isUsernameValid, setUsernameValidity] = useState(false);
  const [doesUsernameExistsonDb, setUsernameExistenceOnDb] = useState(false);
  const [isPasswordValid, setPasswordValidity] = useState(false);
  const [isPasswordRepeatValid, setPasswordRepeatValidity] = useState(false);
  const [areFieldsValid, setFieldsValid] = useState(false);

  //fetch email
  useEffect(() => {
    const checkEmail = async (_email_) => {
      try {
        if (validator.isEmail(_email_)) {
          setEmailValidity(true);
          const { data } = await axios.post("http://localhost:4000/email", {
            email: _email_,
          });
          console.log("Does " + _email_ + " exist on database? " + data);
          if (data === true) {
            setEmailExistenceOnDb(true);
          } else {
            setEmailExistenceOnDb(false);
          }
        } else {
          setEmailValidity(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const delay = setTimeout(() => {
      checkEmail(email);
    }, 500);
    return () => {
      clearTimeout(delay);
    };
  }, [email, setEmailValidity, setEmailExistenceOnDb]);

  //fetch username
  useEffect(() => {
    const checkUsername = async (_username_) => {
      try {
        if (validator.isAlphanumeric(_username_) && _username_.length > 3) {
          setUsernameValidity(true);
          const { data } = await axios.post("http://localhost:4000/username", {
            username: _username_,
          });
          console.log("Does " + _username_ + " exist on database? " + data);
          if (data === true) {
            setUsernameExistenceOnDb(true);
          } else {
            setUsernameExistenceOnDb(false);
          }
        } else if (validator.isAlphanumeric(_username_) === false){
          setUsernameValidity(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const delay = setTimeout(() => {
      checkUsername(username);
    }, 500);
    return () => {
      clearTimeout(delay);
    };
  }, [username, setUsernameValidity, setUsernameExistenceOnDb]);

  const postLoginInfo = async (_loginInfo_) => {
    try {
      await axios.post("http://localhost:4000/register", _loginInfo_);
    } catch (error) {
      console.error(error);
    }
  };

  const emailHandler = (event) => {
    setEmail(event.target.value);
    event.preventDefault();
  };

  const usernameHandler = (event) => {
    setUsername(event.target.value);
    event.preventDefault();
    console.log('Username is ' + username);

  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length > 6) {
      setPasswordValidity(true);
    } else {
      setPasswordValidity(false);
    }
    console.log("Password " + password +" length is " + password.length);
    event.preventDefault();
  };

  const passwordRepeatHandler = (event) => {
    setPasswordRepeat(event.target.value);
    if (event.target.value.length > 6) {
      setPasswordRepeatValidity(true);
    } else {
      setPasswordRepeatValidity(false);
    }
    console.log("Password repeat " + passwordRepeat +" length is " + passwordRepeat.length);
    event.preventDefault();
  };

  const onSubmitHandler = (event) => {
    const onSubmit = async () => {
      areRegistrationFieldsValid();
      if (
        email === "" ||
        username === "" ||
        password === "" ||
        passwordRepeat === ""
      ) {
        alert("Please fill all of the fields before submitting.");
        event.preventDefault();
      } else if (areFieldsValid === true) {
        const loginInfo = {
          email: email,
          username: username,
          password: password,
        };
        await postLoginInfo(loginInfo);
        setEmail("");
        setEmailValidity(false);
        setUsername("");
        setUsernameValidity(false);
        setPassword("");
        setPasswordValidity(false);
        setPasswordRepeat("");
        setPasswordRepeatValidity(false);
        event.preventDefault();
      } else if (areFieldsValid === false) {
        alert("Please conform to the warnings and errors before submitting.");
        event.preventDefault();
      }
    }

    onSubmit(); //call onsubmit function
  };

  const isPasswordRepeated = () => {
    if (password === passwordRepeat) return true;
    return false;
  };

  const areRegistrationFieldsValid = () => {
    if (
      isEmailValid &&
      doesEmailExistsonDb === false &&
      isUsernameValid &&
      doesUsernameExistsonDb === false &&
      isPasswordValid &&
      isPasswordRepeatValid &&
      isPasswordRepeated()
    )
      setFieldsValid(true);
    else setFieldsValid(false);
  };

  return (
    <Container fluid="lg">
      <Row>
        <Col md></Col>
        <Col sm md>
          <Form onSubmit={onSubmitHandler}>
            <div className="mt-2 mb-2">
              <b>Enter your email, username, and password to register.</b>
            </div>
            <Form.Group className="mb-2">
              <Form.Label> Email*: </Form.Label>
              <Form.Control
                type="email"
                placeholder="email"
                onChange={emailHandler}
                value={email}
              ></Form.Control>
              {isEmailValid === false && email !== "" && (
                <div className="assist">⚠️ Please use a real email. </div>
              )}
              {doesEmailExistsonDb && (
                <div className="assist">
                  ❌ This email has been registered. Please use another email.
                </div>
              )}
              {doesEmailExistsonDb === false && isEmailValid && (
                <div className="go">✔️ Email looks good. </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Username*: </Form.Label>
              <Form.Control
                type="username"
                placeholder="username"
                onChange={usernameHandler}
                value={username}
              ></Form.Control>
               { isUsernameValid === false && username !== "" && (
                  <div className="assist">
                    ⚠️  Username has to be consisted of only alphabets and numbers.
                  </div>
                )}
              { username.length <= 3 && username !== "" && (
                  <div className="assist">
                    ⚠️  Username has to be more than 3
                    characters long.
                  </div>
                )}

              {doesUsernameExistsonDb && (
                <div className="assist">
                  ❌: Unfortunately, the username had been taken. Please, choose
                  another username.
                </div>
              )}
              {doesUsernameExistsonDb === false && isUsernameValid && (
                <div className="go">✔️ Username looks good. </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label> Password*: </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={passwordHandler}
                value={password}
              ></Form.Control>
              {isPasswordValid && (
                <PasswordStrengthIndicator password={password} />
              )}
              {isPasswordValid === false && password !== "" && (
                <div className="assist">
                  ⚠️ Password must be more than six characters.
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label> Repeat password*: </Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat password"
                onChange={passwordRepeatHandler}
                value={passwordRepeat}
              ></Form.Control>
              {isPasswordRepeatValid && (
                <PasswordStrengthIndicator
                  password={passwordRepeat}
                />
              )}
              {isPasswordRepeatValid === false && passwordRepeat !== "" && (
                <div className="assist">
                  ⚠️ Password must be more than six characters.
                </div>
              )}
              {isPasswordRepeated() === false && passwordRepeat !== "" && (
                <div className="assist">⚠️ Passwords don't match. </div>
              )}
              {isPasswordRepeatValid && isPasswordValid && isPasswordRepeated() === true && passwordRepeat !== "" && (
                <div className="go">✔️ Passwords match!</div>
              )}
            </Form.Group>
            <Form.Label>
              <div>*) Required.</div>
            </Form.Label>
            <br />
            <Button type="submit">Submit</Button>
          </Form>
        </Col>
        <Col sm md></Col>
      </Row>
    </Container>
  );
};

export default Register;
