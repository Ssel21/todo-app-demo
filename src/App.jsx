import { Container } from "react-bootstrap";
import { Home } from "./components/Home";
import SignUp from "./components/SignUp";
import { AuthProvider } from "./contexts/AuthContext";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
function App() {
  return (
    <>
      <Container style={{ minHeight: "100vh" }}>
        <div
          style={{
            height: "90vh",
          }}
          className="pt-5"
        >
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </div>
      </Container>
    </>
  );
}

export default App;
