import type { NextPage } from 'next';
import { useState } from 'react';

const Home: NextPage = () => {
  const [sistemaOperativo, setSistemaOperativo] = useState({numero: 0, cadena: ''});

  const handleClick = () => {
    const nuevoEstado = {...sistemaOperativo}
    nuevoEstado.numero++;
    setSistemaOperativo(nuevoEstado);
  }

  return (
    <div>
      <div>{sistemaOperativo.numero}</div>
      <button onClick={handleClick}>Incrementar</button>
    </div>
  )
}

export default Home; 