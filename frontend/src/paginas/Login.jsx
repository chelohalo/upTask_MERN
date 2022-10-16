import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'


const Login = () => {

  const [alerta, setAlerta] = useState({
    msg: "",
    error: false
  })
  const [input, setInput] = useState({
    email: "",
    password: ""
  })

  const { setAuth } = useAuth();

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:4000/api/usuarios/login', {
        email: input.email,
        password: input.password
      })
      console.log('datos de logueo', data)
      setAlerta({
        msg: "",
        error: false
      })

      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate('/proyectos')

    } catch (error) {
      console.log(error.response.data.msg)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesión y administra tus <span className="text-slate-700">proyectos</span>
      </h1>

      {alerta.error && <Alerta alerta={alerta} />}
      
      <form
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10">
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email">
            Email
          </label>
          <input
            onChange={handleChange}
            value={input.email}
            name="email"
            type="email"
            id="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password">
            Password
          </label>
          <input
            onChange={handleChange}
            value={input.password}
            name="password"
            type="password"
            id="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>
        <input type="submit"
          value="iniciar sesión"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar">
          No tienes una cuenta? Registrate
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/olvide-password">
          Olvide mi password
        </Link>
      </nav>

    </>
  )
}

export default Login