import React, { ChangeEvent, FC, FormEvent, useMemo, useEffect } from "react";
import { useState } from "react";
// import { USERS } from "./usersData";
import { IUser } from "./IUser";
import { initialUser } from "./initialUser";
import Loader from "../Loader";
import http from "../http";
import axios from "axios";
import { log } from "console";

const Users: FC = () => {
  const [user, setUser] = useState(initialUser);
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      console.log("function getUsers work");

      // получение запросов
      try {
        // console.log("Запрос отправлен");
        const loadingUsers = await http.get("api/users?page=2");

        setUsers(loadingUsers.data.data);
        // console.log("users1.data", users1.data.data1);
      } catch (e) {
        console.log(e);
      }
    };
    getUsers();
  }, []);
  //1 if сптисок зависимостей не указывается, происходит ререндер при каждом изменении стэйта
  //2 если зависимости есть , но пустая то ререндер при первой загрузге
  //3 если список зависимостей равен стэйту, изменения будут происходить на этот стэйт
  //  4 если useEffect  used return  - unmount

  // const deleteUser = (id: number) => {
  //   const isDelete = window.confirm("Do you realy delete  user ?");
  //   if (isDelete) {
  //     setUsers(users.filter((user) => user.id !== id));
  //   }
  // };

  const deleteUser = async (id: number) => {
    console.log("Запрос на удаление");
    try {
      const isDelete = window.confirm("Do you realy delete  user ?");
      if (isDelete) {
        const resp = await http.delete(`api/users/${id}`);
        console.log("del", resp);
        setUsers(users.filter((user) => user.id !== id));
        console.log(resp.data);
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const searchedUsers = useMemo(() => {
    if (search) {
      return users.filter((user) =>
        user.first_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return users;
  }, [search, users]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.id;
    const newValue = event.target.value;
    setUser({ ...user, [field]: newValue });
  };

  // const addUser = (event: FormEvent) => {
  //   event.preventDefault();
  //   setUsers([...users, user]);
  //   setUser(initialUser);
  // };

  const addUser = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const addedUser = await http.post("api/users?page=2", user);

      if (addedUser.data) {
        setUsers([...users, user]);
        setUser(initialUser);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShowUserForm(false);
    }
  };

  //console.log("users", users);
  return (
    <div>
      {/* <div>
        {Object.keys(users).map((el) => (
          <div key={el}>{el}</div>
        ))}
      </div> */}

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Search
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          aria-label="Username"
          aria-describedby="basic-addon1"
          onChange={(event) => setSearch(event.target.value)}
        ></input>
      </div>
      <button
        className="btn btn-success mt-3 mb-3"
        onClick={() => setShowUserForm(!showUserForm)}
      >
        Add new user
      </button>
      {showUserForm && (
        <form onSubmit={(event) => addUser(event)}>
          {Object.keys(user).map((field) => {
            if (field === "id" || field === "avatar") return;
            return (
              <div className="mb-3" key={field}>
                <label htmlFor={field} className="form-label">
                  {field}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={field}
                  required
                  value={user[field as keyof Omit<IUser, "id" | "avatar">]}
                  onChange={(event) => onChange(event)}
                />
              </div>
            );
          })}
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      )}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <div className="col" key={user.id}>
              <div className="card h-100">
                <img src={user.avatar} className="card-img-top" alt="..."></img>
                <div className="card-body">
                  <h5 className="card-title">{`№${user.id} - ${user.email}`}</h5>
                  <p className="card-text">Name:{user.first_name}</p>
                  <p className="card-text">Surname:{user.last_name}</p>
                  {/* <p className="card-text">photo: {user.avatar}</p> */}
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // <h2>Users not exists</h2>
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Users;
