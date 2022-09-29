import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"

const OlvidePassword = () => {
  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({
    msg: "",
    error: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )) {
      setAlerta({
        msg: "el email es obligatorio",
        error: true
      })
      console.log(alerta)
      return
    }
    try {
      const { data } = await axios.post('http://localhost:4000/api/usuarios/olvide-password', {
        email
      })
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
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Recupera tu acceso y no pierdas tus <span className="text-slate-700">proyectos</span>
      </h1>
      
      {alerta.msg && <Alerta alerta={alerta}></Alerta>}

      <form onSubmit={(e) => handleSubmit(e)} className="my-10 bg-white shadow rounded-lg p-10">

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>


        <input type="submit"
          value="Enviar instrucciones"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/">
          Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/registrar">
          No tienes una cuenta? Registrate
        </Link>

      </nav>

    </>
  )
}

export default OlvidePassword