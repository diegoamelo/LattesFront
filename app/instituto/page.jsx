'use client';

import { Button, Label, Modal, Select, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiOutlineExclamationCircle } from '@react-icons/all-files/hi/HiOutlineExclamationCircle';
import { MdDelete } from '@react-icons/all-files/md/MdDelete';
import { useForm } from 'react-hook-form';
import React from 'react';
import { Pagination } from 'flowbite-react';

export default function Instituto() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [objToDelete, setObjToDelete] = useState({});
  const { register, handleSubmit } = useForm();
  const [pageNumber, setPageNumber] = useState(0);

  function handleDelete(instituto) {
    setObjToDelete(instituto), setShowDeleteConfirmation(true);
  }

  function pesquisarInstituto(data) {
    const termo = data.termo;
    const campo = data.campo;
    let url = '';

    switch (campo) {
      case 'Todos':
        url = 'http://localhost:8080/instituto?nomeAcronimo=';
        break;
      case 'Nome':
        url = 'http://localhost:8080/instituto?nome=';
        break;
      case 'Acrônimo':
        url = 'http://localhost:8080/instituto?acronimo=';
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

  function createInstituto(data) {
    fetch('http://localhost:8080/instituto/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: data.nome,
        acronimo: data.acronimo,
      }),
    })
      .then((res) => {
        console.log(res);
        setShowCreateForm(!showCreateForm);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteInstituto(id) {
    fetch(`http://localhost:8080/instituto/${id}`, { method: 'DELETE' })
      .then(console.log('deleted'))
      .then(setShowDeleteConfirmation(!showDeleteConfirmation))
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/instituto?page=${pageNumber}`)
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
        <h1 className="text-4xl font-bold px-4 py-6">Instituto</h1>

        <form
          onSubmit={handleSubmit(pesquisarInstituto)}
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
              <option>Todos</option>
              <option>Nome</option>
              <option>Acrônimo</option>
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
          onClick={() => setShowCreateForm(true)}
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
                Nome Instituto
              </th>
              <th scope="col" className="px-6 py-3">
                Acrônimo
              </th>
              <th cope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.content &&
              data.content.map((Instituto) => (
                <tr
                  key={Instituto.id}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {Instituto.nome}
                  </th>
                  <td className="px-6 py-4">{Instituto.acronimo}</td>
                  <td className="px-6 py-4 space-x-3">
                    <a
                      onClick={() => handleDelete(Instituto)}
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
                Você tem certeza que deseja deletar o instituto{' '}
                {objToDelete.acronimo}?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  color="failure"
                  onClick={() => deleteInstituto(objToDelete.id)}
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
              onSubmit={handleSubmit(createInstituto)}
              className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8"
            >
              <h3 className="text-2xl font-medium text-gray-900 dark:text-white">
                Cadastrar Instituto
              </h3>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="Nome" value="Nome do Instituto" />
                </div>
                <TextInput
                  {...register('nome')}
                  id="nome"
                  name="nome"
                  placeholder="Universidade Federal do Rio de Janeiro"
                  required={true}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="acronimo" value="Acrônimo" />
                </div>
                <TextInput
                  {...register('acronimo')}
                  id="acronimo"
                  name="acronimo"
                  placeholder="UFRJ"
                  required={true}
                />
              </div>
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