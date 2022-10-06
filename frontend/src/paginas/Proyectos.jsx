import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"

const Proyectos = () => {
  const { proyectos } = useProyectos()
  console.log(proyectos)
  
  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ?

          proyectos.map(proyecto =>
            <PreviewProyecto
              proyecto={proyecto}
              key={proyecto._id}
            />
          )

          : <p className="text-center text-gray-600 uppercase p-5">no hay proyectos</p>}
      </div>
    </>
  )
}

export default Proyectos
