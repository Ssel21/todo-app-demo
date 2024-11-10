import { Form, Card, Button, Alert } from "react-bootstrap";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signup = (email, password) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("sample user is : " + userCredential.user);

        navigate("/");
        alert("Sign up Successful!");
      })
      .catch((error) => {
        console.log("errorCode : " + error.code);
        console.log("errorMessage : " + error.message);
        setError(error.message);
      });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    //validate password
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Password don't match");
    }
    try {
      setError("");
      setLoading(true);

      await signup(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card style={{ width: "60%" }}>
        <Card.Body>
          <Card.Title className="text-center">Sign Up</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="emailSignUp mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" required ref={emailRef}></Form.Control>
            </Form.Group>
            <Form.Group id="password" className="passwordSignUp mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                ref={passwordRef}
              ></Form.Control>
            </Form.Group>
            <Form.Group
              id="confirmPasswordSignUp"
              className="confirmPasswordSignUp mb-4"
            >
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                ref={confirmPasswordRef}
              ></Form.Control>
            </Form.Group>
            <Button
              disabled={loading}
              className="w-100"
              variant="outline-primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;
