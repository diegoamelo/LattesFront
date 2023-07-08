'use client';

import { Inter } from 'next/font/google';
import styles from './page.module.css';
import { Button, Label, Modal, Select, TextInput, Card } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import BarChart from './components/BarChart';
import DoughnutChart from './components/DoughnutChart';
import { Doughnut } from 'react-chartjs-2';
import { isEmpty } from 'lodash';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [data, setData] = useState(null);
  const [dataBar, setDataBar] = useState({
    labels: null,
    datasets: [],
  });
  const [dataDoughnut, setDataDoughnut] = useState({
    labels: null,
    datasets: [],
  });

  const [instituto, setInstituto] = useState(null);
  const [pesquisador, setPesquisador] = useState(null);
  const [selectedInstituto, setSelectedInstituto] = useState('');
  const [tipoProducao, setTipoProducao] = useState(null);
  const [totalInstitutos, setTotalInstitutos] = useState(0);
  const [totalPesquisadores, setTotalPesquisadores] = useState(0);
  const [countTotalProducoesPorTipo, setCountTotalProducoesPorTipo] =
    useState(null);
  const [isLoading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const anoInicio = watch('anoInicio');

  function pesquisarProducao(data) {
    const termo = data.termo;
    const campo = data.campo;
    let url = '';
  }

  function agruparPorAno(data) {
    setDataBar({
      labels: data.map((data) => data.anoProducao),
      datasets: [
        {
          label: 'Total prod.',
          data: data.map((data) => data.totalProducao),
          backgroundColor: ['#1a56db'],
        },
      ],
    });
  }

  function insertDataDoughnut(countTotalProducoesPorTipo) {
    setDataDoughnut({
      labels: countTotalProducoesPorTipo.map((data) => data.tipoProducao),
      datasets: [
        {
          label: 'total Prod.',
          data: countTotalProducoesPorTipo.map((data) => data.totalProducao),
          backgroundColor: [
            '#5B8DF0',
            '#135CED',
            '#2A406E',
            '#0F48BA',
          ],
        },
      ],
    });
  }

  function pesquisarProducao({
    anoInicio,
    anoFim,
    instituto,
    pesquisador,
    tipoProducao,
  }) {
    //tem um erro aqui pois não está fazendo a consulta
    fetch(
      `http://localhost:8080/producao/countTotalProducoesPorAno?anoInicio=${anoInicio}&anoFim=${anoFim}&instituto=${instituto}&pesquisador=${pesquisador}&tipoProducao=${tipoProducao}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        agruparPorAno(data);
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
        console.log(pesquisador);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setLoading(true);

    // Fazer a chamada para buscar os pesquisadores quando um instituto for selecionado
    if (selectedInstituto) {
      fetch(
        `http://localhost:8080/pesquisador/list?institutoNome=${selectedInstituto}`
      )
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

    // Fazer a chamada para buscar a lista de produções por ano para geração do gráfico de barras
    setLoading(true);
    fetch(`http://localhost:8080/producao/countTotalProducoesPorAno`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        agruparPorAno(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setLoading(true);

    // Fazer a chamada para buscar a lista de produções por tipo para geração do gráfico de pizza
    fetch('http://localhost:8080/producao/countTotalProducoesPorTipo')
      .then((res) => res.json())
      .then((countTotalProducoesPorTipo) => {
        setCountTotalProducoesPorTipo(countTotalProducoesPorTipo);
        insertDataDoughnut(countTotalProducoesPorTipo);
        // console.log(dataDoughnut);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // Fazer a chamada para buscar o número de institutos cadastrados
    fetch('http://localhost:8080/instituto/count')
      .then((res) => res.json())
      .then((totalInstitutos) => {
        setTotalInstitutos(totalInstitutos);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // Fazer a chamada para buscar o número de pesquisadores cadastrados
    fetch('http://localhost:8080/pesquisador/count')
      .then((res) => res.json())
      .then((totalPesquisador) => {
        setTotalPesquisadores(totalPesquisador);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleInstitutoChange = (event) => {
    const selectedInstitutoNome = event.target.value;
    setSelectedInstituto(selectedInstitutoNome);
  };

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold px-4 py-6">Painel Principal</h1>

        <form
          onSubmit={handleSubmit(pesquisarProducao)}
          className="flex justify-between items-center"
        >
          <div className="block mr-4">
            <TextInput
              {...register('anoInicio')}
              className="w-23"
              id="anoInicio"
              name="anoInicio"
              placeholder="Ano Início"
              type="number"
            />
          </div>

          <div className="block mr-4">
            <TextInput
              {...register('anoFim', {
                validate: (value) => {
                  if (isEmpty(anoInicio) || value >= anoInicio) {
                    return true;
                  }
                  return 'Ano Fim deve ser maior ou igual a Ano Início';
                },
              })}
              className="w-23"
              id="anoFim"
              name="anoFim"
              placeholder="Ano Fim"
              type="number"
              //disabled={!anoInicio}
            />
            {errors.anoFim && <span>{errors.anoFim.message}</span>}
          </div>

          <div className="mr-4" id="select">
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
          </div>

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

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Pesquisar
            </button>
          </div>
        </form>
      </div>

      <div className="pb-8 w-full">
        <BarChart chartData={dataBar} />
      </div>

      <div className="grid gap-x-8 gap-y-4 grid-cols-4">
        <Card
          href="/producao"
          className="row-span-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
        >
          <h3 className="text-3xl font-normal  dark:text-gray-400 flex flex-col items-center justify-center">
            Total Produção
          </h3>
          <DoughnutChart dataDoughnut={dataDoughnut} />
        </Card>

        <Card
          href="/instituto"
          className="row-span-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
        >
          <h3 className="text-3xl font-normal  dark:text-gray-400 flex flex-col items-center justify-center">
            Institutos
          </h3>
          <p className="text-5xl font-bold tracking-tight  dark:text-white flex flex-col items-center justify-center">
            {totalInstitutos}
          </p>
        </Card>

        <Card
          href="/pesquisador"
          className="row-span-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
        >
          <h3 className="text-3xl font-normal  dark:text-gray-400 flex flex-col items-center justify-center">
            Pesquisadores
          </h3>
          <p className="text-5xl font-bold tracking-tight  dark:text-white flex flex-col items-center justify-center">
            {totalPesquisadores}
          </p>
        </Card>

        <Card
          href="/grafo"
          className="row-span-1 bg-zinc-800 text-zinc-400 hover:bg-zinc-900"
        >
          <h3 className="text-3xl font-normal  dark:text-gray-400 flex flex-col items-center justify-center">
            Grafos
          </h3>
          <p className="text-5xl font-bold tracking-tight dark:text-white flex flex-col items-center justify-center">
            GRAFOS
          </p>
        </Card>
      </div>
    </div>
  );
}
