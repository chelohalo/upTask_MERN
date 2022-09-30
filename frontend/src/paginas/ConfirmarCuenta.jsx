import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Alerta from "../components/Alerta"

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({})
  const { id } = useParams()

  useEffect(() => {
    const confirmarToken = async () => {
      try {
        const url = `http://localhost:4000/api/usuarios/confirmar/${id}`
        const { data } = await axios.get(url)
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
    confirmarToken()
  }, [])

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu cuenta y comienza a crear tus <span className="text-slate-700">proyectos</span>
      </h1>
      {
        alerta.msg &&
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
          <Alerta alerta={alerta} />
          {!alerta.error && <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >Inicia sesión
          </Link>}
        </div>
      }
    </>
  )
}

export default ConfirmarCuenta