
const generarId = () => {
  
  const number = Math.random().toString(32).substring(2)
  const date = Date.now().toString(32) 
    return number + date
}

export default generarId