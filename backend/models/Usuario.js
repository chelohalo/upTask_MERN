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
    console.log(salt)
    this.password = await bcrypt.hash(this.password, salt)

})

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario
