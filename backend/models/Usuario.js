import mongoose from "mongoose";
import bcrypt, { genSalt } from 'bcrypt'

const usuarioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        token: {
            type: String,
        },
        confirmado: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    let result = await bcrypt.compare(passwordFormulario, this.password)
   
    return result
}


const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
