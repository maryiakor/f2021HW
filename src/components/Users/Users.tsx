import React, { ChangeEvent, FC, FormEvent, useMemo } from "react";
import { useState } from "react";
import { USERS } from "./usersData";
import { IUser } from "./IUser";
import { initialUser } from "./initialUser";

const Users: FC = () => {
  const [user, setUser] = useState(initialUser);
  const [users, setUsers] = useState<IUser[]>(USERS);
  const [search, setSearch] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);

  const deleteUser = (id: number) => {
    const isDelete = window.confirm("Do you realy delete  user ?");
    if (isDelete) {
      setUsers(users.filter((user) => user.id !== id));
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

  const addUser = (event: FormEvent) => {
    event.preventDefault();
    setUsers([...users, user]);
    setUser(initialUser);
  };

  return (
    <div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Searchgi