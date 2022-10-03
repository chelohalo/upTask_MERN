import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

const checkAuth = async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            req.usuario = await Usuario.findById(decoded.id).select("_id nombre email")
            
            return next()

        } catch (error) {
            return res.status(404).send({msg: 'Token no válido'})
        }
    }

    if(!token) {
        const error = new Error('No se envió el token')
        return res.status(401).json({msg: error.message})
    }

    next()
}

export default checkAuth;