'use client';

import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiOutlineExclamationCircle } from '@react-icons/all-files/hi/HiOutlineExclamationCircle';
import { MdDelete } from '@react-icons/all-files/md/MdDelete';
import { BiSearchAlt2 } from '@react-icons/all-files/bi/BiSearchAlt2';
import { useForm } from 'react-hook-form';
import Instituto from '../instituto/page';
import React from 'react';
import { Pagination } from 'flowbite-react';
// import * as ReactSelect from 'react-select';

export default function Pesquisador() {
  const [data, setData] = useState(null);
  const [institutoList, setInstitutoList] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [objToDelete, setObjToDelete] = useState({});
  const { register, handleSubmit } = useForm();
  const [pageNumber, setPageNumber] = useState(0);

  function handleDelete(pesquisador) {
    setObjToDelete(pesquisador), setShowDeleteConfirmation(true);
  }

  function pesquisarPesquisador(data) {
    const termo = data.termo;
    const campo = data.campo;
    let url = '';

    switch (campo) {
      case 'Nome':
        url = 'http://localhost:8080/pesquisador?nome=';
        break;
      case 'Identificador':
        url = 'http://localhost:8080/pesquisador?identificador=';
        break;
    }

    fetch(url + termo)
      .then(console.log('pesquisa realizada com o campo' + campo))
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => console.log(err));
  }

  function addPesquisador(data) {
    console.log(data);

    fetch(
      `http://localhost:8080/pesquisador/add/${data.pesquisador}/instituto/${data.instituto}`,
      { method: 'POST' }
    )
      .then(console.log('Adicionado'))
      .then((res) => console.log(res))
      .then(setShowCreateForm(!showCreateForm))
      .catch((err) => console.log(err));
  }

  function deletePesquisador(identificador) {
    fetch(`http://localhost:8080/pesquisador/excluir/${identificador}`, {
      method: 'DELETE',
    })
      .then(console.log('deleted'))
      .then(setShowDeleteConfirmation(!showDeleteConfirmation))
      .catch((err) => console.log(err));
  }

  function handleOpenModalIncluirPesquisador() {
    fetch('http://localhost:8080/instituto/')
      .then((res) => res.json())
      .then((data) => {
        setInstitutoList(data);
      })
      .catch((err) => console.log(err));

    setShowCreateForm(true);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/pesquisador?page=${pageNumber}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [showDeleteConfirmation, showCreateForm, pageNumber]);

  return (
    <div className="mx-2">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold px-4 py-6">Pesquisador</h1>

        <form
          onSubmit={handleSubmit(pesquisarPesquisador)}
          className='flex justify-between items-center"'
        >
          <div className="block mr-4">
            <TextInput
              {...register('termo')}
              className="w-96"
              id="termo"
              name="termo"
              placeholder="Termo de pesquisa"
            />
          </div>

          <div className="mr-4" id="select">
            <Select
              {...register('campo')}
              id="camp"
              name="campo"
              required={true}
            >
              <option>Nome</option>
              <option>Identificador</option>
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

        <button
          type="button"
          onClick={() => handleOpenModalIncluirPesquisador()}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Incluir
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                UF
              </th>
              <th scope="col" className="px-6 py-3">
                Identificador
              </th>
              <th cope="col" className="px-6 py-3">
                Instituto
              </th>
              <th cope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content &&
              data.content.map((pesquisador) => (
                <tr
                  key={pesquisador.identificador}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {pesquisador.nome}
                  </th>
                  <td className="px-6 py-4">{pesquisador.ufNascimento}</td>
                  <td className="px-6 py-4">{pesquisador.identificador}</td>
                  <td className="px-6 py-4">{pesquisador.instituto}</td>
                  <td className="px-6 py-4 space-x-3">
                    <a
                      onClick={() => handleDelete(pesquisador)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                    >
                      <MdDelete size={'2em'} />
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

      {/* MODAL DELETE CONFIRMATION */}
      <>
        <Modal
          show={showDeleteConfirmation}
          size="md"
          popup={true}
          onClose={() => setShowDeleteConfirmation(!showDeleteConfirmation)}
          objToDelete={objToDelete}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Você tem certeza que deseja deletar o pesquisador{' '}
                {objToDelete.nome}?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => deletePesquisador(objToDelete.identificador)}
                >
                  Sim, tenho ceteza
                </Button>
                <Button
                  color="gray"
                  onClick={() =>
                    setShowDeleteConfirmation(!showDeleteConfirmation)
                  }
                >
                  Não, cancelar
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>

      {/* MODAL INSERIR */}

      <>
        <Modal
          show={showCreateForm}
          size="md"
          popup={true}
          onClose={() => setShowCreateForm(!showCreateForm)}
        >
          <Modal.Header />
          <Modal.Body>
            <form
              onSubmit={handleSubmit(addPesquisador)}
              className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                Cadastrar Pesquisador
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Nome" value="Id pesquisador" />
                </div>
                <div>
                  <TextInput
                    {...register('pesquisador')}
                    id="pesquisador"
                    name="pesquisador"
                    required={true}
                  />
                </div>
              </div>
              <Select
                {...register('instituto')}
                id="instituto"
                name="instituto"
                required={true}
              >
                <option value="">Selecione um instituto</option>
                {institutoList &&
                  institutoList.map((instituto) => (
                    <option value={instituto.id}>{instituto.nome}</option>
                  ))}
              </Select>
              <div className="flex justify-between"></div>
              <div>
                <Button type="submit" className="w-full">
                  Cadastrar
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}
