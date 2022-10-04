import { useState, useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Alerta from "./Alerta";

const FormularioProyecto = () => {
  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();
  const params = useParams()

  const [id, setId] = useState(params.id)
  const [nombre, setNombre] = useState(params.id ? proyecto?.nombre : '');
  const [descripcion, setDescripcion] = useState(params.id ? proyecto?.descripcion : '');
  const [fechaEntrega, setFechaEntrega] = useState(params.id ? proyecto?.fechaEntrega?.slice(0,10) : '');
  const [cliente, setCliente] = useState(params.id ? proyecto?.cliente : '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
      mostrarAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });

      return;
    }

    // Pasar los datos hacia el provider
    await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente });
    
    setId(null)
    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
  };

  return (
    <form
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
      htmlFor="nombre"
      onSubmit={handleSubmit}
    >
      {alerta.msg && <Alerta alerta={alerta} />}

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="nombre"
        >
          Nombre Proyecto
        </label>
        <input
          id="nombre"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          type="text"
          placeholder="Nombre del Proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="descripcion"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Descripción del Proyecto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="fecha-entrega"
        >
          Fecha Entrega
        </label>
        <input
          id="fecha-entrega"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="cliente"
        >
          Nombre Cliente
        </label>
        <input
          id="cliente"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          type="text"
          placeholder="Nombre del Proyecto"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value={params.id? "Editar Proyecto": "Crear Proyecto"}
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition colors"
      />
    </form>
  );
};

export default FormularioProyecto;
