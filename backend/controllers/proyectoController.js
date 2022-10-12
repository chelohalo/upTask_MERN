import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js"

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find().where('creador').equals(req.usuario).select('-tareas')

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
    const { id } = req.params
    let proyecto

    try {
        proyecto = await Proyecto.findById(id).populate('tareas')
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: error.message })
    }

    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({ msg: error.message })
    }

    return res.json(proyecto)
}

const editarProyecto = async (req, res) => {
    const { id } = req.params
    let proyecto

    try {
        proyecto = await Proyecto.findById(id)
        console.log(proyecto)
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: error.message })
    }

    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({ msg: error.message })
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
    const { id } = req.params
    let proyecto

    try {
        proyecto = await Proyecto.findById(id)
        console.log(proyecto)
    } catch (error) {
        console.log(error)
        const errorM = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: errorM.message })
    }

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).send({ msg: error.message })
    }

    if (req.usuario.id.toString() !== proyecto.creador.toString()) {
        const error = new Error('Solicite permiso al propietario para acceder')
        return res.status(401).send({ msg: error.message })
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto eliminado" })
    } catch (error) {
        console.log(error)
    }
}


const buscarColaborador = async (req, res) => {
    const {email} = req.body
    let usuario
    
    try {
        usuario = await Usuario.findOne().where('email').equals(email).select('email nombre _id')
    } catch (error) {
        const message = new Error('No se ha encontrado dicho email')
        return res.status(400).send('errorrr')
    }
    
    if(!usuario){
        const error = new Error("Usuario no encontrado")   
        return res.status(404).json({msg: error.message}) 
    }

    return res.json(usuario)

}

const agregarColaborador = async (req, res) => {
    const { id } = req.params // id del proyecto
    
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto) {
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }
    
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tiene permisos para agregar colaboradores. Solicitelos.");
        return res.status(404).json({ msg: error.message });
    }
    
    const { email } = req.body // email del colaborador
    const usuario = await Usuario.findOne({ email }).select("_id nombre email")

    if(!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    

    // El colaborador no es el administrador del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("El creador no puede ser colaborador");
        return res.status(404).json({ msg: error.message });
    }

    //Que el colaborador ya haya sido agregado
    if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("El usuario ya ha sido agregado");
        return res.status(404).json({ msg: error.message });
    }

    // Esta todo bien, podemos agregar al colaborador
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador agregado correctamente'})

}
const eliminarColaborador = async (req, res) => {

}


export {
    obtenerProyecto,
    nuevoProyecto,
    obtenerProyectos,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
}
