'use client';

import { Inter } from 'next/font/google';
import { Button, Label, Modal, Select, TextInput, Card } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CytoscapeComponent from 'react-cytoscapejs';

const inter = Inter({ subsets: ['latin'] });

export default function Grafo() {
  const [instituto, setInstituto] = useState(null);
  const [pesquisador, setPesquisador] = useState(null);
  const [selectedInstituto, setSelectedInstituto] = useState('');
  const [tipoProducao, setTipoProducao] = useState(null);
  const [tipoVertice, setTipoVertice] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, watch,} = useForm();

  {/* const para o cytoscapejs */}

  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("800px");
  

  //Adding elements here
  const [graphData, setGraphData] = useState([
    //Node format
    
    { data: { id: '0023809873085852', label: 'Rodrigo Salvador Monteiro'}},
    { data: { id: '0024160866319507', label: 'Leonardo da Silva Gasparini'}},
    { data: { id: '0028876341054325', label: 'Marcelo dos Santos MagalhÃ£es'}},
    { data: { id: '0047810385809553', label: 'Aleksandra Menezes de Oliveira'}},
    { data: { id: '0053636364868790', label: 'Lismeia Raimundo Soares'}},
    { data: { id: '0066576690749759', label: 'Gizele da ConceiÃ§Ã£o Soares Martins'}},
    { data: { id: '0082487176176434', label: 'Marialda Moreira Christoffel'}},
    { data: { id: '0110662125645595', label: 'RogÃ©rio Ferreira de Moraes'}},
    { data: { id: '0112621452737067', label: 'VinÃ­cius AntÃ´nio Gomes Marques'}},
    { data: { id: '0161902355523060', label: 'Vinicios Batista Pereira'}},
    { data: { id: '0194631586754988', label: 'Michael Maia Mincarone'}},
    { data: { id: '0235080730138338', label: 'Rute Ramos da Silva Costa'}},
    { data: { id: '0263660448893625', label: 'Jussara Mathias Netto Khouri'}},
    { data: { id: '0329773854976808', label: 'Patricia Regina Affonso de Siqueira'}},
    { data: { id: '0348923590713594', label: 'MÃ¡rcio JosÃ© de Medeiros'}},
    { data: { id: '0485361810192703', label: 'LuÃ­s Claudio de Carvalho'}},
    { data: { id: '0491984479926888', label: 'Rafael Malheiro da Silva do Amaral Ferreira'}},
    { data: { id: '0549723858731158', label: 'Danielle Marques de Araujo Stapelfeldt'}},
    { data: { id: '0559800226477492', label: 'VinÃ­cius Albano AraÃºjo'}},
    { data: { id: '0600549075776976', label: 'Juliana Milanez'}},
    { data: { id: '0604237405440586', label: 'Glaucimara Riguete de Souza Soares'}},
    { data: { id: '0658455060876989', label: 'Leonardo Lima dos Santos'}},
    { data: { id: '0659726776097432', label: 'Karine da Silva Verdoorn'}},
    { data: { id: '0676650998291996', label: 'Fernando Fernandes Morgado'}},
    { data: { id: '0692400140993944', label: 'Raquel Silva de Paiva'}},
    { data: { id: '0743793296062293', label: 'Daniel Cardoso Moraes de Oliveira'}},
    { data: { id: '0770145420421898', label: 'LÃ©sia MÃ´nica de Souza Gestinari'}},
    { data: { id: '0781779929562675', label: 'Camila Rolim Laricchia'}},
    { data: { id: '0814717344017544', label: 'Kate Cerqueira Revoredo'}},

  //Edge format
    { data: { source: '0235080730138338', target: '0604237405440586', label: '1'}},
    { data: { source: '0023809873085852', target: '0743793296062293', label: '1'}},
    { data: { source: '0082487176176434', target: '0329773854976808', label: '3'}},
    { data: { source: '0194631586754988', target: '0770145420421898', label: '2'}},
    { data: { source: '0235080730138338', target: '0781779929562675', label: '1'}},
  ]);

  {/* Controle de cores nos campos de escolha de cor das arestas */}

  const [selectedColors, setSelectedColors] = useState(['', '', '']);

  {/* Controle de valores nos campos numéricos */}

  const [campo1, setCampo1] = useState(1);
  const [campo2, setCampo2] = useState(campo1);
  const [campo3, setCampo3] = useState(campo2 + 1);
  const [campo4, setCampo4] = useState(campo3);
  const [campo5, setCampo5] = useState(campo4 + 1);
  const [campo6, setCampo6] = useState(10000);
  
  function pesquisarGrafo({instituto, pesquisador, tipoProducao, tipoVertice}) {
    fetch(`http://localhost:8080/grafo?instituto=${instituto}&pesquisador=${pesquisador}&tipoProducao=${tipoProducao}&tipoVertice=${tipoVertice}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        agruparPorTipoVertice(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setLoading(true);

    // Fazer a chamada para buscar a lista de institutos
    fetch('http://localhost:8080/instituto/list')
      .then((res) => res.json())
      .then((instituto) => {
        setInstituto(instituto);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // Fazer a chamada para buscar a lista de pesquisadores
    fetch('http://localhost:8080/pesquisador/list')
      .then((res) => res.json())
      .then((pesquisador) => {
        setPesquisador(pesquisador);
        setLoading(false);
      })
    .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setLoading(true);

    // Fazer a chamada para buscar os pesquisadores quando um instituto for selecionado
    if (selectedInstituto) {
      fetch(`http://localhost:8080/pesquisador/list?institutoNome=${selectedInstituto}`)
        .then((res) => res.json())
        .then((pesquisador) => {
          setPesquisador(pesquisador);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedInstituto]);

  useEffect(() => {
    setLoading(true);

    // Fazer a chamada para buscar os tipos de produção
    fetch('http://localhost:8080/tipoProducao')
      .then((res) => res.json())
      .then((tipoProducao) => {
        setTipoProducao(tipoProducao);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setLoading(true);

      // Fazer a chamada para buscar os tipos de vertices
      fetch('http://localhost:8080/tipoVertice')
      .then((res) => res.json())
      .then((tipoVertice) => {
        setTipoVertice(tipoVertice);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  {/* Controle de cores nos campos de escolha de cor das arestas */}

  // const handleSelect1Change = (event) => {
  //   const color = event.target.value;
  //   if (color !== selectedColors[1] && color !== selectedColors[2]) {
  //     setSelectedColors([color, selectedColors[1], selectedColors[2]]);
  //   }
  // };

  // const handleSelect2Change = (event) => {
  //   const color = event.target.value;
  //   if (color !== selectedColors[0] && color !== selectedColors[2]) {
  //     setSelectedColors([selectedColors[0], color, selectedColors[2]]);
  //   }
  // };

  // const handleSelect3Change = (event) => {
  //   const color = event.target.value;
  //   if (color !== selectedColors[0] && color !== selectedColors[1]) {
  //     setSelectedColors([selectedColors[0], selectedColors[1], color]);
  //   }
  // };
  
  {/* Controle de valores nos campos numéricos */}

  const handleCampo2Change = (e) => {
    const value = parseInt(e.target.value);
    if (value >= campo1) {
      setCampo2(value);
      setCampo3(value + 1);
      if ((value + 1) > campo4){
        setCampo4(value + 1);
        setCampo5(value + 2);
      }
    }
  };

  const handleCampo4Change = (e) => {
    const value = parseInt(e.target.value);
    if (value > campo3) {
      setCampo4(value);
      setCampo5(value + 1);
    }
  };

  const handleInstitutoChange = (event) => {
    // assume que o valor do option é o nome do instituto
    const selectedInstitutoNome = event.target.value;
    setSelectedInstituto(selectedInstitutoNome);
  };

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold px-4 py-6">Grafo</h1>

        <form
          onSubmit={handleSubmit(pesquisarGrafo)}
          className='flex justify-between items-center"'
        >
          {/* <div className="mr-4" id="select">
            <Select
              {...register('instituto')}
              value={selectedInstituto}
              onChange={handleInstitutoChange}
              id="campo"
              name="instituto"
            >
              <option value="">Instituto</option>
              {instituto &&
                instituto.map((instituto) => (
                  <option value={instituto.nome}>{instituto.nome}</option>
                ))}
            </Select>
          </div> */}

          <div className="mr-4" id="select">
            <Select {...register('pesquisador')} id="campo" name="pesquisador">
              <option value="">Pesquisador</option>
              {pesquisador &&
                pesquisador.map((pesquisador) => (
                  <option value={pesquisador.nome}>{pesquisador.nome}</option>
                ))}
            </Select>
          </div>

          <div className="mr-4" id="select">
            <Select
              {...register('tipoProducao')}
              id="campo"
              name="tipoProducao"
            >
              <option value="">Tipo Prod.</option>
              {tipoProducao &&
                tipoProducao.map((tipo) => (
                  <option key={tipo} value={tipo.nome}>
                    {tipo}
                  </option>
                ))}
            </Select>
          </div>

          <div className="mr-4" id="select">
            <Select {...register('tipoVertice')} name="tipoVertice" required={true}>
              <option value="">Tipo Vertice</option>
              {tipoVertice && tipoVertice.map((tipoVertice) => (
                <option key={tipoVertice} value={tipoVertice.nome}>
                  {tipoVertice}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <button type="submit" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            > 
              Aplicar
            </button>
          </div>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-5">
        <div className="">
          <form onSubmit={() => {}} className=" grid items-center gap-5 grid-cols-5 text-center" style={{ gridTemplateColumns: '50% 20% 20%' }}>
            <p className="text-2xl">Vértice (Cor)</p>
            <p className="text-2xl">Valor NP (início)</p>
            <p className="text-2xl">Valor NP (fim)</p>
          </form>

          <form onSubmit={() => {}} className=" grid items-center gap-5 grid-cols-5" style={{ gridTemplateColumns: '50% 20% 20%' }}>
            <div className="grid items-center gap-5 ">
              <div className="column">
                <Select value={selectedColors[0]} >
                  <option value="">Vermelha</option>
                </Select>
                <Select value={selectedColors[1]} >
                  <option value="">Amarela</option>
                </Select>
                <Select value={selectedColors[2]} >
                  <option value="">Verde</option>
                </Select>
              </div>
            </div>
            
            <div className="grid items-center gap-5 text-center">
              <div className="column">
                <input
                  disabled
                  type="number"
                  placeholder="Campo 1"
                  value={campo1}
                  style={{ color: 'black' }}
                />
                <input
                  disabled
                  type="number"
                  placeholder="Campo 3"
                  value={campo3}
                  style={{ color: 'black' }}
                />
                <input
                  disabled
                  type="number"
                  placeholder="Campo 5"
                  value={campo5}
                  style={{ color: 'black' }}
                />
              </div>
            </div>

            <div className="grid items-center gap-5 text-center">
              <div className="column">
                <input
                  type="number"
                  placeholder="Campo 2"
                  value={campo2}
                  onChange={handleCampo2Change}
                  style={{ color: 'black' }}
                />
                <input
                  type="number"
                  placeholder="Campo 4"
                  value={campo4}
                  onChange={handleCampo4Change}
                  style={{ color: 'black' }}
                />
                <input
                  disabled
                  type="number"
                  placeholder="Campo 6"
                  value={campo6}
                  style={{ color: 'black' }}
                />
              </div>
            </div>
          </form>

          <div className="pb-8 w-full">
            <h1>Gerador de Grafo</h1>
            <div style={{border: "1px solid", backgroundColor: "#f5f6fe"}}>
              <CytoscapeComponent
                elements={graphData}
                style={{ width: width, height: height }}
                
                //adding a layout
                layout={{
                  name: 'concentric',
                  fit: true,
                  directed: true,
                  padding: 50,
                  animate: true,
                  animationDuration: 1000,
                  avoidOverlap: true,
                  nodeDimensionsIncludeLabels: false
                }}
                
                //adding style sheet
                stylesheet={[
                  {
                    selector: "node",
                    style: {
                      backgroundColor: "#1258e0",
                      width: 60,
                      height: 60,
                      "text-valign": "center",
                      "text-halign": "center",
                      "overlay-padding": "6px",
                      "z-index": "10"
                    }
                  },
                  {
                    selector: "node:selected",
                    style: {
                      label: "data(label)",
                      "border-width": "6px",
                      "border-color": "#0F48BA",
                      "border-opacity": "0.5",
                      "background-color": "#5B8DF0",
                      "text-outline-color": "#5c5959"
                    }
                  },
                  {
                    selector: "label",
                    style: {
                      color: "black",
                      width: 30,
                      height: 30,
                      fontSize: 12
                    }
                  },
                  {
                    selector: "edge",
                    style: {
                      width: 3,
                      label: "data(label)",
                      "line-color": "#BC2800",
                      "target-arrow-color": "#6774cb",
                      "curve-style": "bezier"
                    }
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}