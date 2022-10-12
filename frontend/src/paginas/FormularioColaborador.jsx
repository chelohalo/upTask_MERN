import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "../components/Alerta";


const FormularioColaborador = () => {

    const { submitColaborador, mostrarAlerta, alerta } = useProyectos();
    const [email, setEmail] = useState("")

    const handleSubmit = async e => {
        
        e.preventDefault()
        if( email === ''){
            mostrarAlerta({
                msg:'por favor complete el email',
                error: true
            })
            return
        }
        
        mostrarAlerta({})
        submitColaborador(email)
        
    }

    
  return (
    <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
    onSubmit={handleSubmit}>
        {alerta.msg && <Alerta alerta={alerta}/>}
      <div className="mb-5">
        <label
          htmlFor="email"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Email Colaborador
        </label>
        <input
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          type="email"
          id="email"
          placeholder="Email del Usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <input
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
        value='Buscar Colaborador'
      />
    </form>
  );
}

export default FormularioColaborador