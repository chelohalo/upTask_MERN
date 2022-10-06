export const formatearFecha = fecha => {
  
  const fechaArray = fecha.split("T")[0].split("-")
  
  const nuevaFecha = new Date(fechaArray)

  const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return nuevaFecha.toLocaleDateString('es-ES', opciones)
}