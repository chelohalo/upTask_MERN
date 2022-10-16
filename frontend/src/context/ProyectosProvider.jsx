import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  const [modalActualizarTarea, setModalActualizarTarea] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token desde proyectosprovider", token);
        if (!token) {
          return;
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:4000/api/proyectos",
          config
        );
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerProyectos();
  }, [auth]);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 3000);
  };

  const submitProyecto = async (proyecto) => {
    if (proyecto.id) {
      await editarProyecto(proyecto);
    } else {
      await agregarProyecto(proyecto);
    }
  };

  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `http://localhost:4000/api/proyectos/${proyecto.id}`,
        proyecto,
        config
      );

      setProyectos(
        proyectos.map((proy) => (proy._id !== data._id ? proy : data))
      );

      setAlerta({
        msg: "Proyecto editado correctamente",
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const agregarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/proyectos",
        proyecto,
        config
      );

      setProyectos([...proyectos, data]);

      setAlerta({
        msg: "Proyecto creado correctamente",
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarProyecto = async (id) => {
    const result = window.confirm("¿Estàs seguro que deseas eliminarlo?");
    if (!result) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `http://localhost:4000/api/proyectos/${id}`,
        config
      );

      setProyectos(proyectos.filter((proy) => proy._id !== id));

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4000/api/proyectos/${id}`,
        config
      );

      setProyecto(data);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const submitTarea = async (tarea) => {
    const editar = tarea.id;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (!editar) {
        const { data } = await axios.post(
          `http://localhost:4000/api/tareas`,
          tarea,
          config
        );

        const proyectoActualizado = {
          ...proyecto,
          tareas: [...proyecto.tareas, data],
        };

        setProyecto(proyectoActualizado);

        setAlerta({
          msg: "La tarea se creo correctamente",
          error: false,
        });
      } else {
        const { data } = await axios.put(
          `http://localhost:4000/api/tareas/${tarea.id}`,
          tarea,
          config
        );

        const proyectoActualizado = {
          ...proyecto,
          tareas: proyecto.tareas.map((tareaState) =>
            tareaState._id === data._id ? data : tareaState
          ),
        };

        setProyecto(proyectoActualizado);

        setAlerta({
          msg: "La tarea se editó correctamente",
          error: false,
        });
      }
      setTimeout(() => {
        setModalFormularioTarea(false);
        setAlerta({});
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async (tarea) => {
    const id = tarea._id;
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/tareas/${id}`,
        config
      );

      // console.log(data)

      // setAlerta({
      //   msg: data,
      //   error: false
      // })

      mostrarAlerta({
        msg: data,
        error: false,
      });

      const proyectoActualizado = {
        ...proyecto,
        tareas: proyecto.tareas.filter((tareaState) => tareaState._id !== id),
      };

      setProyecto(proyectoActualizado);
    } catch (error) {
      console.log(error);
    } finally {
      setModalEliminarTarea(!modalEliminarTarea);
      setTarea({});
    }
  };

  const submitColaborador = async (email) => {
    setCargando(true);
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/proyectos/colaboradores",
        { email },
        config
      );

      setColaborador(data);
      setAlerta({});
    } catch (error) {
      mostrarAlerta({
        msg: error.response.data.msg,
        error: true,
      });
      setColaborador({});
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      );
      mostrarAlerta({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      mostrarAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
  };

  const eliminarColaborador = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        config
      );

      setProyecto({
        ...proyecto,
        colaboradores: proyecto.colaboradores.filter(
          (colab) => colab._id !== colaborador._id
        ),
      });

      mostrarAlerta({
        msg: data.msg,
        error: false,
      });
    } catch (error) {
      mostrarAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    } finally {
      handleModalEliminarColaborador({});
    }
  };
  
  

  const handleModalActualizarTarea = (tarea) => {
    setModalActualizarTarea(!modalActualizarTarea);
    setTarea(tarea)
  };

  const actualizarTarea = async (idTarea) => {

    console.log(idTarea)

    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.put(`http://localhost:4000/api/tareas/estado/${idTarea}`, {}, config)
      setProyecto({
        ...proyecto,
        //tareas: proyecto.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState )
        tareas: proyecto.tareas.map(tareaState => tareaState._id === tarea._id ? {...tareaState, estado : !
          tareaState.estado} : tareaState )
      })

      
      console.log(data)

       mostrarAlerta({
        msg: 'Estado actualizado',
         error: false
       })

    } catch (error) {
      mostrarAlerta({
        msg: error.data.response.msg,
        error: true
      })
    }finally{
      setModalActualizarTarea(!modalActualizarTarea)
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
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        handleModalActualizarTarea,
        modalActualizarTarea,
        actualizarTarea
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
