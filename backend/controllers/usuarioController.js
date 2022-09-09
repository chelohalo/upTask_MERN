import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"

const registrar = async (req, res) => {

    const {email} = req.body
    const existeUsuario = await Usuario.findOne({ email })

    if(existeUsuario){
        const error = new Error('usuario ya registrado')
        return res.status(400).send({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()
        res.status(200).send({msg:"usuario creado correctamente",
                            usuario: usuarioAlmacenado})
    } catch (error) {
        console.log(error)
        res.status(400).send('fallo por alguna razon la carga')
    }
}

export {registrar}