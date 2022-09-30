import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {
  const { token } = useParams()
  const [alerta, setAlerta] = useState({

    msg: "",
    error: false
  })

  const [input, setInput] = useState({
    password: "",
    repitePassword: ""
  })

  useEffect(() => {

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        setAlerta({
          msg: data.msg,
          error: false
        })

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    fetchData()


  }, [])



  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.password !== input.repitePassword) {
      setAlerta({
        msg: "Las contraseñas no coinciden",
        error: true
      })
      return
    }
    try {
      const {data} = await axios.post(`http://localhost:4000/api/usuarios/olvide-password/${token}`, 
      { password: input.password })
      console.log(data)
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
      console.log(error)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
    console.log('se envio el form')
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y no pierdas acceso a tus <span className="text-slate-700">proyectos</span>
      </h1>

      {(alerta.msg === "La password fue actualizada correctamente" || alerta.msg === "Token no válido") && 
      <>
        <Alerta alerta={alerta} />
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/">
          Inicia sesión
        </Link>
      </>}

      {alerta.msg === "El token no existe" && <Alerta alerta={alerta} />}

      {(alerta.msg === "Token válido y el usuario existe" || alerta.msg === "Las contraseñas no coinciden") &&
      <>
        {alerta.msg === "Las contraseñas no coinciden" && <Alerta alerta={alerta} />}
        <form
          onSubmit={handleSubmit}
          className="my-10 bg-white shadow rounded-lg p-10">


          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">
              Nuevo Password
            </label>
            <input
              onChange={handleChange}
              value={input.password}
              type="password"
              id="password"
              name="password"
              placeholder="Escribe el nuevo password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password2">
              Repite el Password
            </label>
            <input
              onChange={handleChange}
              value={input.repitePassword}
              type="password"
              id="password2"
              name="repitePassword"
              placeholder="Repite el password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <input type="submit"
            value="Guardar Nuevo Password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
        </form>
        </>
        }

      <nav className="lg:flex lg:justify-between">

      </nav>

    </>
  )
}

export default NuevoPassword