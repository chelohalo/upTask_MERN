import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext() 

const AuthProvider = ({children}) => {
    
    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    useEffect(()=>{
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token");
            console.log('token desde authprovider', token)
            if(!token){
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await axios.get(
                  "http://localhost:4000/api/usuarios/perfil",
                  config);
                setAuth(data)
                // navigate('/proyectos')

            } catch (error) {
                setAuth({})

            } finally{
                setCargando(false)
            }
        }
        autenticarUsuario()
    }, []) 

    return (
      <AuthContext.Provider
        value={{
            cargando,
            auth,
            setAuth
        }}
      >
        {children}
      </AuthContext.Provider>
    );
}

export {
    AuthProvider
}

export default AuthContext;