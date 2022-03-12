import { Box, Center, Flex, Grid, GridItem, Input } from '@chakra-ui/react';
import { Observable } from 'rxjs'
import type { NextPage } from 'next';

import { SistemaOperativo } from '../class/SistemaOperativo';
import React, { useEffect, useState } from 'react';
import { ContenedorSeccion } from '../component/seccion/ContenedorSeccion';
import { SeccionEjecucion } from '../component/seccion/SeccionEjecucion';
import { TituloSeccion } from '../component/seccion/TituloSeccion';
import { SeccionListos } from '../component/seccion/SeccionListos';
import { SeccionNuevos } from '../component/seccion/SeccionNuevos';
import { SeccionBloqueados } from '../component/seccion/SeccionBloqueados';
import { SeccionTerminados } from '../component/seccion/SeccionTerminados';
import { SeccionInformacion } from '../component/SeccionInformacion';
import { Boton } from '../component/Boton';

// *****************************************************************************************************************************
const VELOCIDAD = 1000;
const MENSAJE_PROGRAMA_TERMINADO = 'Programa Finalizado';
export const GLOBAL_COLOR = '#DAF7DC';
export const GLOBAL_SECONDARY_COLOR = '#84DCC6';
export const GLOBAL_BORDER_RADIUS = 15;

// === App =====================================================================================================================
const sistemaOperativoOriginal = new SistemaOperativo(10, null, [], [], [], 0, [], 'Activo');

const observableSistemaOperativo$: Observable<SistemaOperativo> = new Observable(subscriber => {
  subscriber.next(sistemaOperativoOriginal);
  subscriber.complete();
});

const Home: NextPage = () => {

  // --- State ------------------------------------------------------------------------------------
  const [sistemaOperativoMostrado, setSistemaOperativoMostrado] = useState<SistemaOperativo>(sistemaOperativoOriginal);
  const [isInterrupcion, setIsInterrupcion] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isPausa, setIsPausa] = useState<boolean>(false);
  const [isNuevoProceso, setIsNuevoProceso] = useState<boolean>(false);
  const [isTablaProcesos, setIsTablaProcesos] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const [isEvaluado, setIsEvaluado] = useState<boolean>(false);
  const [isComenzado, setIsComenzado] = useState<boolean>(false);
  const [isTerminado, setIsTerminado] = useState<boolean>(false);



  // --- Effects ------------------------------------------------------------------------------------
  useEffect(() => {
    const modificarEstadoSO = setInterval(() => {
      // Modificar SO 
    });
    return () => clearInterval(modificarEstadoSO);
  });

  useEffect(() => {
    const actualizarSistemaOperativoMostrado = setInterval(() => {
      observableSistemaOperativo$.subscribe({
        next: estadoSO => {
          const newEstadoSO = { ...estadoSO };
          setSistemaOperativoMostrado(newEstadoSO as any /*NOTE: Look for bugs here*/);
        },
        error: err => console.log(err),
        complete: () => { }
      });

    }, VELOCIDAD);

    return () => clearInterval(actualizarSistemaOperativoMostrado);
  });

  // --- Handlers --------------------------------------------------------------------------------------
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => { setInputValue((e.target as HTMLInputElement).value); }
  const handleInterrupcion = () => { setIsInterrupcion(!isInterrupcion); }
  const handleError = () => { setIsError(!isError); }
  const handleEvaluar = () => {
    if (parseInt(inputValue) && parseInt(inputValue) > 0) {
      setIsEvaluado(!isEvaluado);
      setMensaje('Cantidad De Procesos Válida');

      sistemaOperativoOriginal.setCantidadProcesos(parseInt(inputValue));
      sistemaOperativoOriginal.inicializar();

    } else {
      setMensaje('Cantidad De Procesos Inválida');
    }
  }

  return (
    <Grid h='100vh' templateRows='repeat(10, 1fr)' templateColumns='repeat(10, 1fr)'>
      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowSpan={3}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionEjecucion procesoMostrado={sistemaOperativoMostrado.getProcesoEnEjecucion()!/*NOTE: If err look here*/} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        colStart={5}
        rowStart={1}
        rowSpan={3}
        colSpan={6}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>

        <ContenedorSeccion>
          <TituloSeccion nombreSeccion='Controles' />
          <Box w='100%' h='100%' py={2} borderColor='gray.300'>
            <Center>
              {!isEvaluado &&
                <Input
                  m={10}
                  mt={50}
                  placeholder={'Cantidad de procesos...'}
                  value={inputValue}
                  onChange={handleChange}
                  borderRadius={GLOBAL_BORDER_RADIUS}
                  padding={5}
                />
              }
            </Center>

            {
              !isEvaluado
                ?
                <Center>
                  <Boton contenido={'Evaluar Cantidad (Dar Click Aquí)'} width={'50%'} callback={handleEvaluar} />
                </Center>
                : null
            }

            {
              (isEvaluado && !isComenzado) &&
              <Flex mt={10}>
                <Boton contenido={'Comenzar (Tecla C)'} width={'100%'} callback={() => setIsComenzado(!isComenzado)} />
              </Flex>
            }

            {(isComenzado && !isTerminado) &&
              <Flex mt={10}>
                <Boton contenido={`${isPausa ? 'Continuar (Tecla P)' : 'Pausar (Tecla P)'}`} width={'100%'} callback={() => setIsPausa(!isPausa)} />
                <Boton contenido={'Interrupción (Tecla I)'} width={'100%'} callback={handleInterrupcion} />
                <Boton contenido={'Marcar Error (Tecla E)'} width={'100%'} callback={handleError} />

                {
                  !isTerminado &&
                  <>
                    <Boton contenido={'Terminar (Tecla T)'} width={'100%'} callback={() => { setIsTerminado(!isTerminado); setMensaje(MENSAJE_PROGRAMA_TERMINADO); }} />
                  </>
                }
              </Flex>
            }
            <Center mt={5}>
              <Box fontSize={15}>{mensaje}</Box>
            </Center>
          </Box>
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={4}
        rowSpan={4}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>

        <ContenedorSeccion>
          <SeccionListos procesosListos={sistemaOperativoMostrado.getProcesosListos()} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        colStart={5}
        rowStart={4}
        rowSpan={4}
        colSpan={6}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionNuevos procesosNuevos={sistemaOperativoMostrado.getProcesosNuevos()} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colSpan={4}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionBloqueados procesosBloqueados={sistemaOperativoMostrado.getProcesosBloqueados()} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colStart={5}
        colSpan={3}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionTerminados procesosTerminados={sistemaOperativoMostrado.getProcesosTerminados()} />
        </ContenedorSeccion>
      </GridItem>

      <GridItem
        overflowX={'scroll'}
        overflowY={'scroll'}
        gridAutoFlow={'column'}
        rowStart={8}
        rowSpan={3}
        colStart={8}
        colSpan={3}
        bg={GLOBAL_COLOR}
        borderRadius={GLOBAL_BORDER_RADIUS}>
        <ContenedorSeccion>
          <SeccionInformacion valorReloj={sistemaOperativoMostrado.getReloj()} />
        </ContenedorSeccion>
      </GridItem>

    </Grid>);
}

export default Home