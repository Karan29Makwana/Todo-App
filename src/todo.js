import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const App = () => {
  const [inputlist, setInputlist] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [userName, setUserName] = useState("");
  const [items, setItems] = useState([]);
  const [newArray, setNewArray] = useState([]);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEdit, setisEdit] = useState(null);
  const [show, setShow] = useState(false);
  const url = "http://localhost:4000/todos";
  const [getData, setGetdata] = useState([]);
  const [listUserName, setlistUserName] = useState("");
  const [storeid, setstoreid] = useState("");

  const mergeState = { completed: newArray, task: items };
  // console.log("mergeState-----", mergeState);

  // get list by id
  const FetchData = async (id) => {
    const { data } = await axios.get(`${url}/${id}`);
    let name = Object.keys(data)[0];
    setlistUserName(name);
    setstoreid(id);
    setItems(data[name].task);
    setNewArray(data[name].completed);
  };
  // console.log(storeid, "storeid");

  //post data in api
  const CreateTodo = async (name) => {
    // e.preventDefault();
    let body = {
      [name]: {
        completed: newArray,
        task: items,
      },
    };
    await axios.post(url, body).then(() => {
      getTodos();
    });
    setShow(false);
  };

  //update by id
  const updateTodo = () => {
    setShowUpdate((prev) => !prev);
  };

  // update api
  const updateApi = (storeid) => {
    let body = {};
    body[listUserName] = mergeState;
    console.log(body, "body");
    // console.log("storeid---", storeid);
    axios.put(`${url}/${storeid}`, body).then(() => {
      getTodos();
    });
  };

  //Delete by id
  const deleteTodo = (e, id) => {
    e.stopPropagation();
    axios.delete(`${url}/${id}`).then(() => {
      getTodos();
    });
  };

  //Get data in api
  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () => {
    axios.get(url).then((response) => {
      setGetdata(response.data);
    });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // let data = newArray.flat();
  const changeHandler = (e) => {
    setInputlist(e.target.value);
  };

  const changeUserHandler = (e) => {
    setUserName(e.target.value);
  };

  const clearTask = () => {
    setItems([]);
  };

  const clearCompletedTask = () => {
    setNewArray([]);
  };

  //add list
  const addItem = (event) => {
    event.preventDefault();
    if (inputlist && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          if (elem.id === isEdit) {
            return { ...elem, task: inputlist };
          }
          return elem;
        })
      );
      setToggleSubmit(true);
      setInputlist("");
      setisEdit(null);
    } else {
      setItems((oldItems) => {
        return [...oldItems, { id: new Date().getTime(), task: inputlist }];
      });
      setInputlist("");
    }
  };

  //add list into completed task
  const wishItem = (id) => {
    let tempArray = [...newArray];
    tempArray.push(items.find((obj) => obj.id === id));
    // console.log("tempArray1", tempArray);
    setNewArray(tempArray);
    items.splice(
      items.findIndex((obj) => obj.id === id),
      1
    );
    setItems([...items]);
  };

  //markall task to completed task
  const markAllTask = () => {
    setNewArray(items);
    setItems([]);
  };

  //markall completed task to task
  const markAllCompletedTask = () => {
    setItems(newArray);
    setNewArray([]);
  };

  //delete list item
  const deleteList = (id) => {
    const DeleteListItem = items.filter((num) => {
      return num.id !== id;
    });
    setItems(DeleteListItem);
  };

  //remove item from completed task and add into list
  const RemoveWishItem = (item) => {
    let tempArray = [...items];
    tempArray.push(newArray[item]);
    setItems(tempArray);
    newArray.splice(item, 1);
    setNewArray([...newArray]);
  };

  //update list item
  const EditItem = (id) => {
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });
    // console.log(newEditItem, "newEditItem");
    setToggleSubmit(false);
    setInputlist(newEditItem.task);
    setisEdit(id);
  };

  const handleDragEnd = (results) => {
    if (!results.destination) return;
    let tempList = [...items];
    let [selectedRow] = tempList.splice(results.source.index, 1);
    tempList.splice(results.destination.index, 0, selectedRow);
    setItems(tempList);
  };
  // console.log(items, "items");
  // console.log(newArray, "newarray");
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>List Api</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <input
              type="text"
              placeholder="name"
              value={userName}
              onChange={changeUserHandler}
              className="form-control"
            />

            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => CreateTodo(userName)}
              >
                Save
              </button>
              {/* <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={() => CreateTodo(userName)}
              >
                Save
              </Button> */}
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        <div
          className="backgroundColor container-fluid"
          style={{ height: "100vh" }}
        >
          <div align="center" className="header px-5 py-2 rounded">
            <span className="h1 m-2" style={{ color: "white" }}>
              Todo List App
            </span>
          </div>
          <div className="row p-5">
            <div className="todo-child col-6 card">
              <table className="table table-hover" id="allListTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Task</th>
                    <th>Completed Task</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {getData.map((element) => {
                    let name = Object.keys(element)[0];
                    // console.log(element, "element");
                    return (
                      <tr
                        key={element.id}
                        onClick={() => FetchData(element.id)}
                      >
                        <td>{name}</td>
                        <td>{element[name].task.length}</td>
                        <td>{element[name].completed.length}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) => deleteTodo(e, element.id)}
                          >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => updateTodo()}
                          >
                            <i
                              className="fa fa-pencil fa-sm"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="card shadow-lg col-6 p-2">
              <div className="p-2">
                <div align="center">
                  <h5>{listUserName}</h5>
                </div>
                <div className="header d-flex  justify-content-between px-5 py-2 rounded">
                  <span className="h3 m-0" style={{ color: "white" }}>
                    Task
                  </span>
                  <div className="d-flex  justify-content-between">
                    <button
                      type="button"
                      className="btn btn-sm btn-light me-2"
                      onClick={handleShow}
                    >
                      Create
                    </button>
                    {showUpdate && (
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => {
                          // console.log(e, "e");
                          return updateApi(storeid);
                        }}
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>

                {/* Todo area */}
                <div className="py-2">
                  <form className="d-flex">
                    <input
                      type="text"
                      placeholder="Add Items"
                      value={inputlist}
                      onChange={changeHandler}
                      className="form-control"
                    />
                    {toggleSubmit ? (
                      <button
                        className="ms-2 btn btn-primary"
                        type="submit"
                        onClick={addItem}
                      >
                        Add
                      </button>
                    ) : (
                      <button
                        className="ms-2 btn btn-primary"
                        type="submit"
                        onClick={addItem}
                      >
                        Update
                      </button>
                    )}
                  </form>

                  <div className="h-100 py-3">
                    <div className="todo-container">
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {items.map((itemvalue, index) => {
                              return (
                                // draggableId={String(new Date().getTime())}
                                <Draggable
                                  draggableId={String(index)}
                                  key={index}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="d-flex justify-content-between"
                                    >
                                      <h3 {...provided.dragHandleProps}>
                                        {index + 1} . {itemvalue.task}
                                      </h3>

                                      <div>
                                        <button
                                          className="btn btn-sm btn-success m-1"
                                          onClick={() => wishItem(itemvalue.id)}
                                        >
                                          <i
                                            className="fa-solid fa-check-to-slot fa-sm"
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-info m-1"
                                          onClick={() => EditItem(itemvalue.id)}
                                        >
                                          <i
                                            className="fa fa-pencil fa-sm"
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger m-1"
                                          onClick={() =>
                                            deleteList(itemvalue.id)
                                          }
                                        >
                                          <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                          ></i>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    <div className="d-flex justify-content-between ">
                      <button
                        className="m-2 btn btn-success"
                        type="submit"
                        onClick={markAllTask}
                      >
                        Mark all
                      </button>
                      <button
                        className="m-2 btn btn-secondary"
                        type="submit"
                        onClick={clearTask}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {newArray.length > 0 && (
                <div>
                  <div className="header  px-5 py-2 rounded">
                    <span className="h3 m-0" style={{ color: "white" }}>
                      Completed Task
                    </span>
                  </div>

                  <div className="completedata-container">
                    {newArray.map((itemvalue, index) => {
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between"
                        >
                          <h3 style={{ textDecoration: "line-through" }}>
                            {index + 1} . {itemvalue.task}
                          </h3>

                          <button
                            className="btn btn-sm btn-secondary m-1"
                            onClick={() => RemoveWishItem(index)}
                          >
                            <i
                              className="fa-regular fa-circle-xmark fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-between ">
                    <button
                      className="m-2 btn btn-success"
                      type="submit"
                      onClick={markAllCompletedTask}
                    >
                      Mark all
                    </button>
                    <button
                      className="m-2 btn btn-secondary"
                      type="submit"
                      onClick={clearCompletedTask}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default App;
