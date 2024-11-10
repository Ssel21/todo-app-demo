import { Form, Card, Button, Alert } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = (email, password) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/");
        alert("Welcome!" + userCredential.user.email);
      })
      .catch((error) => {
        console.log("errorCode : " + error.code);
        console.log("errorMessage : " + error.message);
        setError(error.message);
      });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      await signIn(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card style={{ width: "60%" }}>
        <Card.Body>
          <Card.Title className="text-center">Log In</Card.Title>
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

export default Login;
