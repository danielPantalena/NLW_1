import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import axios from 'axios';

import './CreatePoint.css';

import logo from '../../assets/logo.svg';
import Mapa from './Map/Map';

// Sempe que criamos um estado,
//   precisamos informar manualmente os tipos

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFapiResponse {
  sigla: string;
}

const CreatePoint = () => {
  const [items, setItems] = React.useState<Item[]>([]);
  const [ufs, setUfs] = React.useState<string[]>([]);

  React.useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios
      .get<IBGEUFapiResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufLetters = response.data.map(({ sigla }) => sigla);
        setUfs(ufLetters);
      });
  }, []);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Mapa />
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            {/* CIDADE!!! */}
            {/* <div className="field">
              <label htmlFor="uf">Cidade</label>
              <select name="uf" id="uf">
                <option value="0">Selecione uma UF</option>
                {}
              </select>
            </div> */}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(({ id, title, image_url }) => (
              <li key={id}>
                <img src={image_url} alt={title} />
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastras ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
