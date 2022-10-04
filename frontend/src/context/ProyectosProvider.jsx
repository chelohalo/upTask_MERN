import { useState, useEffect, createContext } from "react";
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const navigate = useNavigate()
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState([]);
  const [proyecto, setProyecto] = useState({})
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
        const { data } = await axios.get('http://localhost:4000/api/proyectos', config)
        setProyectos(data)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProyectos()

  }, [])

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  const submitProyecto = async (proyecto) => {
    if(proyecto.id){
      await editarProyecto(proyecto)

    } else {
      await agregarProyecto(proyecto)
      
    }
  }

  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await axios.put(`http://localhost:4000/api/proyectos/${proyecto.id}`, proyecto, config);

      setProyectos(proyectos.map(proy => proy._id !== data._id ? proy : data))

      setAlerta({
        msg: 'Proyecto editado correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 1000);

    } catch (error) {
      console.log(error);
    }
  }

  const agregarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await axios.post("http://localhost:4000/api/proyectos", proyecto, config);

      setProyectos([...proyectos, data])

      setAlerta({
        msg: 'Proyecto creado correctamente',
        error: false
      })
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 1000);

    } catch (error) {
      console.log(error);
    }
  }
  
  const eliminarProyecto = async (id) => {
    const result = window.confirm('¿Estàs seguro que deseas eliminarlo?')
    if (!result) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await axios.delete(`http://localhost:4000/api/proyectos/${id}`, config)
      
      setProyectos(proyectos.filter(proy => proy._id !== id))
      
      setAlerta({
        msg: data.msg,
        error: false
      })
            
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 1000);

    } catch (error) {
      console.log(error)
    }
  }

  const obtenerProyecto = async (id) => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await axios.get(`http://localhost:4000/api/proyectos/${id}`, config)

      setProyecto(data)

    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
