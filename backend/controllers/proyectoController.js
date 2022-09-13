import Proyecto from "../models/Proyecto.js"

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario)

    res.json(proyectos)
}
const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id
    
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerProyecto = async (req, res) => {
    const {id} = req.params
    let proyecto

    try {
        proyecto = await Proyecto.findById(id)
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({msg: error.message})
    }
    
    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({msg: error.message})
    }

    return res.json(proyecto)

}

const editarProyecto = async (req, res) => {
    const {id} = req.params
    let proyecto
    
    try {
        proyecto = await Proyecto.findById(id)
        console.log(proyecto)
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({msg: error.message})
    }
    
    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({msg: error.message})
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoActualizado = await proyecto.save()
    } catch (error) {
        console.log(error)
    }
    
    return res.json(proyecto)
}

const eliminarProyecto = async (req, res) => {
    const {id} = req.params
    let proyecto
    
    try {
        proyecto = await Proyecto.findById(id)
        console.log(proyecto)
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({msg: error.message})
    }
    
    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({msg: error.message})
    }

    try {
        await proyecto.deleteOne();
        res.json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.log(error)
    }
}


const agregarColaborador = async (req, res) => {

}
const eliminarColaborador = async (req, res) => {

}
const obtenerTareas = async (req, res) => {
    
}

export {
    obtenerProyecto,
    nuevoProyecto,
    obtenerProyectos,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas
}
