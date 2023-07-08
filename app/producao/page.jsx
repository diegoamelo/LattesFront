'use client';

import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Pagination } from 'flowbite-react';
import { isEmpty } from 'lodash';

export default function Producao() {
  const [data, setData] = useState(null);
  const [instituto, setInstituto] = useState(null);
  const [pesquisador, setPesquisador] = useState(null);
  const [selectedInstituto, setSelectedInstituto] = useState('');
  const [tipoProducao, setTipoProducao] = useState(null);
  const [producaoList, setProducaoList] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm();
  const anoInicio = watch('anoInicio');
  const [pageNumber, setPageNumber] = useState(0);

  function pesquisarProducao({
    anoInicio,
    anoFim,
    instituto,
    pesquisador,
    tipoProducao,
  }) {
    //tem um erro aqui pois não está fazendo a consulta
    fetch(
      `http://localhost:8080/producao?anoInicio=${anoInicio}&anoFim=${anoFim}&instituto=${instituto}&pesquisador=${pesquisador}&tipoProducao=${tipoProducao}&page=0`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
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

    // Fazer a chamada para buscar uma página de produções
    fetch(
      `http://localhost:8080/producao?anoInicio=${getValues(
        'anoInicio'
      )}&anoFim=${getValues('anoFim')}&instituto=${getValues(
        'instituto'
      )}&pesquisador=${getValues('pesquisador')}&tipoProducao=${getValues(
        'tipoProducao'
      )}&page=${pageNumber}`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(getValues(anoInicio));
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [pageNumber]);

  const handleInstitutoChange = (event) => {
    const selectedInstitutoNome = event.target.value;
    setSelectedInstituto(selectedInstitutoNome);
  };

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold px-4 py-6">Produção</h1>

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
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 max-w-sm text-center">
                Titulo
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Ano
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Tipo de Produção
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Pesquisador
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content &&
              data.content.map((producao) => (
                <tr
                  key={producao.id}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <td className="px-6 py-4 max-w-sm whitespace-normal">
                    {producao.nome}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Ver como fazer para esse link funcionar */}
                    <a
                      href={`/producao?ano=${producao.ano}`}
                      className="hover:underline"
                    >
                      {producao.ano}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Ver como fazer para esse link funcionar */}
                    <a
                      href={`/producao?tipoProducao=${producao.tipoProducao}`}
                      className="hover:underline"
                    >
                      {producao.tipoProducao}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Ver como fazer para esse link funcionar */}
                    <a
                      href={`/producao?pesquisador=${producao.pesquisador}`}
                      className="hover:underline"
                    >
                      {producao.pesquisador}
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-center text-center">
        <Pagination
          currentPage={pageNumber}
          layout="pagination"
          nextLabel="Próxima"
          onPageChange={(page) => setPageNumber(page - 1)}
          previousLabel="Anterior"
          showIcons
          totalPages={data && data.totalPages}
        />
      </div>
    </div>
  );
}
