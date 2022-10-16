import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  const tarea = req.body;

  const proyecto = await Proyecto.findById(tarea.proyecto);
  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).send({ msg: error.message });
  }

  if (req.usuario._id.toString() !== proyecto.creador.toString()) {
    const error = new Error("Solicite permiso al propietario para acceder");
    return res.status(403).send({ msg: error.message });
  }

  try {
    const nuevaTarea = await Tarea.create(tarea);
    proyecto.tareas.push(nuevaTarea._id);
    await proyecto.save();
    res.json(nuevaTarea);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).send({ msg: error.message });
  }

  if (req.usuario._id.toString() !== tarea.proyecto.creador.toString()) {
    const error = new Error("Solicite permiso al propietario para acceder");
    return res.status(403).send({ msg: error.message });
  }

  res.json(tarea);
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params; // el id de la tarea a modificar
  const tarea = await Tarea.findById(id).populate("proyecto");
  const tareaModificada = req.body;

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).send({ msg: error.message });
  }

  if (req.usuario._id.toString() !== tarea.proyecto.creador.toString()) {
    const error = new Error("Solicite permiso al propietario para acceder");
    return res.status(403).send({ msg: error.message });
  }

  const keysModificadas = Object.keys(tareaModificada);
  keysModificadas.forEach((key) => (tarea[key] = tareaModificada[key]));

  try {
    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params; // el id de la tarea a eliminar
  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).send({ msg: error.message });
  }

  if (req.usuario._id.toString() !== tarea.proyecto.creador.toString()) {
    const error = new Error("Solicite permiso al propietario para acceder");
    return res.status(403).send({ msg: error.message });
  }

  try {
    await Tarea.deleteOne(tarea);
    res.json("Tarea eliminada");
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params; // el id de la tarea a modificar
  let tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).send({ msg: error.message });
  }

  if (
    req.usuario.id?.toString() !== tarea.proyecto.creador?.toString() &&
    !tarea.proyecto.colaboradores?.some(
      (proy) => proy._id?.toString() === req.usuario.id?.toString()
    )
  ) {
    const error = new Error("Solicite permiso al propietario para acceder");
    return res.status(403).send({ msg: error.message });
  }

  try {
    tarea.estado = !tarea.estado;
    await tarea.save();
  } catch (error) {
    const err = new Error("No se pudo modificar el estado");
    return res.status(404).send({ msg: err.message });
  }

  res.json(tarea);
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
