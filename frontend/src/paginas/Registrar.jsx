import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import axios from "axios";

const Registrar = () => {
  const [alerta, setAlerta] = useState({});
  const [input, setInput] = useState({
    nombre: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setAlerta({});
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.values(input)
        .map((e) => e.length > 2)
        .includes(false)
    ) {
      setAlerta({
        msg: "todos los campos son obligatorios",
        error: true,
      });
      return;
    }
    if (input.password !== input.password2) {
      setAlerta({
        msg: "pass no coinciden",
        error: true,
      });
      return;
    }
    if (input.password.length < 6) {
      setAlerta({
        msg: "pass too short",
        error: true,
      });
      return;
    }
    console.log(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`, {
        nombre: input.nombre,
        password: input.password,
        email: input.email,
      });
      setAlerta({
        msg: data.msg,
        error: false,
      });
      setInput({
        nombre: "",
        email: "",
        password: "",
        password2: "",
      });
    } catch (error) {
      setAlerta({ msg: error.response.data.msg, error: true });
      console.log(error.response.data.msg);
    }
  };

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea tu cuenta y administra tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {alerta.msg && <Alerta alerta={alerta}></Alerta>}
      <form
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10"
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="nombre"
          >
            Nombre
          </label>
          <input
            onChange={handleChange}
            value={input.nombre}
            type="text"
            id="nombre"
            placeholder="Ingresa tu nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            onChange={handleChange}
            value={input.email}
            type="email"
            id="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            onChange={handleChange}
            value={input.password}
            type="password"
            id="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password2"
          >
            Repetir Password
          </label>
          <input
            onChange={handleChange}
            value={input.password2}
            type="password"
            id="password2"
            placeholder="Repetir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <input
          type="submit"
          value="Crear cuenta"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/olvide-password"
        >
          Olvide mi password
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
