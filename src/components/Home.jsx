import { useState } from "react";
import {
  Form,
  Row,
  Container,
  Col,
  Button,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [editModal, setEditModal] = useState(false);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState({
    id: 0,
    title: "",
    isCompleted: false,
    notes: "",
    dueDate: "",
    isPriority: false,
    priorityNo: null,
  });

  const [editTask, setEditTask] = useState({
    id: 0,
    title: "",
    isCompleted: false,
    notes: "",
    dueDate: "",
    isPriority: false,
    priorityNo: null,
  });

  const addTask = () => {
    const isTitleEmpty = checkifEmpty(task.title);
    if (isTitleEmpty) {
      alert("Please enter a task!");
    } else {
      setTodos((oldTodos) => {
        return [
          ...oldTodos,
          { ...task, id: crypto.randomUUID(), title: task.title },
        ];
      });
      setTask({
        id: 0,
        title: "",
        isCompleted: false,
        notes: [],
        dueDate: "",
        isPriority: false,
        priorityNo: null,
      });
    }
  };

  const onTaskSubmit = (e) => {
    e.preventDefault();
  };

  const taskCompleted = (e, tsk) => {
    let completedItem;
    let itemIndex;

    todos.map((item, index) => {
      if (item.id === tsk.id) {
        //get current task value from list
        completedItem = { ...item, isCompleted: true };
        //get task index
        itemIndex = index;
      }
    });
    //remove item completed from todos
    todos.splice(itemIndex, 1);
    //add item completed to completed todos
    completedTodos.splice(completedTodos.length, 0, completedItem);
    //update list of todos and completed todos
    setTodos([...todos]);
    setCompletedTodos([...completedTodos]);
  };

  const checkIfUserIsSignedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is logged in");
      } else {
        navigate("login");
      }
    });
  };
  checkIfUserIsSignedIn();
  const checkifEmpty = (value) => {
    return (
      value == null || (typeof value === "string" && value.trim().length === 0)
    );
  };

  const handleEditModal = (id, state) => {
    //filter task to edit
    const toEdit = todos.find((tsk) => tsk.id === id);
    switch (state) {
      case "close":
        setEditModal(false);
        break;
      case "open":
        setEditTask(toEdit);
        setEditModal(true);
        break;
      default:
        break;
    }
  };

  const saveTodoChanges = () => {
    setTodos((oldTodos) => {
      return oldTodos.map((item) => {
        if (item.id === editTask.id) {
          return { ...item, dueDate: editTask.dueDate, notes: editTask.notes };
        }
        return item;
      });
    });
    setEditModal(false);
    setEditTask({
      id: 0,
      title: "",
      isCompleted: false,
      notes: "",
      dueDate: "",
      isPriority: false,
      priorityNo: null,
    });
  };

  const deleteTodo = (tsk) => {
    const filteredTodos = todos.filter((item) => item.id !== tsk.id);
    setTodos(filteredTodos);
    alert(`Task  ${tsk.title} "deleted!`);
  };

  const setAsPriority = (tsk) => {
    let itemIndex;
    const toPrioritize = todos.find((item, index) => {
      if (item.id === tsk.id) {
        itemIndex = index;
        return item;
      }
    });

    todos.splice(itemIndex, 1);
    todos.splice(0, 0, toPrioritize);
    let newTodos = [...todos];
    setTodos(newTodos);
  };

  const logout = () => {
    auth.signOut().then(
      () => {
        alert("Signed out");
        navigate("login");
      },
      (error) => {
        alert("Sign Out Errort", error);
      }
    );
  };

  return (
    <>
      <Container>
        <Row className="justify-content-end pt-3">
          <Button
            variant="outline-secondary"
            style={{ width: "200px" }}
            onClick={logout}
          >
            Logout
          </Button>
        </Row>
      </Container>
      <Form onSubmit={onTaskSubmit} style={{ width: "100%" }}>
        <Container className="mt-4">
          <Row>
            <Col xs={10}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Control
                  type="text"
                  value={task.title}
                  placeholder="Enter a task here"
                  onChange={(e) => {
                    setTask({ ...task, title: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              {" "}
              <Button type="submit" variant="light" onClick={addTask}>
                Add a task
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
      <Container>
        {todos && todos?.length != 0 && <h5 className="mt-4"> To do</h5>}
        <ListGroup>
          {todos.map((item, index) => (
            <ListGroup.Item key={index}>
              {" "}
              <Row key={index}>
                <Col xs={1} md={1} lg={1}>
                  <Form.Check // prettier-ignore
                    type="checkbox"
                    id="default-checkbox"
                    label=""
                    checked={item.isCompleted}
                    onChange={(e) => taskCompleted(e, item)}
                    onPointerDown={(e) => e.currentTarget.blur()}
                    key={index}
                  />
                </Col>

                <Col xs={8} md={8} lg={8}>
                  {" "}
                  {item.title}{" "}
                </Col>
                <Col xs={3} md={3} lg={3}>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleEditModal(item.id, "open")}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="outline-secondary"
                    onClick={() => setAsPriority(item)}
                  >
                    Priority
                  </Button>{" "}
                  <Button
                    variant="outline-secondary"
                    onClick={() => deleteTodo(item)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>

      <Container>
        {completedTodos && completedTodos?.length != 0 && (
          <h5 className="mt-4"> Completed Tasks</h5>
        )}

        <ListGroup>
          {completedTodos.map((item, index) => (
            <ListGroup.Item key={index}>
              {" "}
              <Row key={index}>
                <Col xs={1}>
                  <Form.Check // prettier-ignore
                    type="checkbox"
                    id="default-checkbox"
                    label=""
                    checked={item.isCompleted}
                    onChange={(e) => taskCompleted(e, item)}
                    key={index}
                  />
                </Col>
                {item.title}{" "}
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>

      <Modal
        show={editModal}
        onHide={() => handleEditModal(editTask.id, "close")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit {editTask.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="mm/dd/yyyy"
                    value={editTask.dueDate}
                    onChange={(e) => {
                      setEditTask({
                        ...editTask,
                        dueDate: e.currentTarget.value,
                      });
                      console.log(
                        "due date selected : " + e.currentTarget.value
                      );
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    aria-label="Enter your notes here..."
                    value={editTask.notes}
                    onChange={(e) => {
                      setEditTask({
                        ...editTask,
                        notes: e.currentTarget.value,
                      });
                      console.log(
                        "here is the notes : " + e.currentTarget.value
                      );
                    }}
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleEditModal(editTask, "close")}
          >
            Close
          </Button>
          <Button variant="primary" onClick={saveTodoChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
