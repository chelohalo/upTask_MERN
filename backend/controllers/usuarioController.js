import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro } from "../helpers/emails.js"

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
        await usuario.save()

        //Enviar el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.status(200).send({msg:"usuario creado correctamente, revisa tu email para conf tu cuenta"})
    } catch (error) {
        console.log(error)
        res.status(400).send('fallo por alguna razon la carga')
    }
}

const autenticar = async (req, res) => {
    //comprobar si el usuario existe
    const {email, password} = req.body
    // console.log(email)
    const usuario = await Usuario.findOne({ email })

    if(!usuario){
        const error = new Error('Usuario no existe')
        return res.status(404).send({ msg: error.message })
    }

    //comprobar que la cuenta haya sido validada
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido validada')
        return res.status(403).send({ msg: error.message })
    }

    //comprobar que la contraseña es correcta
    if( await usuario.comprobarPassword(password) === false ) {
        const error = new Error('La contraseña no es correcta')
        return res.status(404).send({ msg: error.message })
    }
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    })
}

const confirmar = async (req, res) => {
    const {token} = req.params

    const usuarioConfirmar = await Usuario.findOne({ token })
    if(!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(404).send({ msg: error.message })
    }
    
    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ''
        await usuarioConfirmar.save()
        res.json({msg: 'Usuario confirmado correctamente'})
        
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({ email })

    if(!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).send({ msg: error.message })
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        return res.json({ msg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params
    console.log(req.params)
    const existeToken = await Usuario.findOne({ token })    
    
    if(!existeToken){
        const error = new Error('El token no existe')
        return res.status(404).send({ msg: error.message }) 
    }
    return res.json({msg: "Token válido y el usuario existe"})
}

const nuevoPassword = async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    
    const usuario = await Usuario.findOne({ token })

    if(usuario) {
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({msg: 'La password fue actualizada correctamente.'})
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error('Token no válido')
        res.status(404).send({msg: error.message})
    }
}

const perfil = async (req, res) => {
    const { usuario } = req
    res.json(usuario)
}

export {registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil}