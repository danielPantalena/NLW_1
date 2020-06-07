import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import axios from 'axios';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './CreatePoint.css';

import logo from '../../assets/logo.svg';

// Sempe que criamos um estado,
//   precisamos informar manualmente os tipos

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEufApiResponse {
  sigla: string;
}

interface IGBEcityApiResponse {
  nome: string;
}

const CreatePoint = () => {
  //  SETTING VARIABLES
  //    STATE VARIABLES
  //      All options
  const [items, setItems] = React.useState<Item[]>([]);
  const [initialPosition, setInitialPosition] = React.useState<[number, number]>([0, 0]);
  const [ufs, setUfs] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);
  //      Selected options
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = React.useState<[number, number]>([0, 0]);
  const [selectedUf, setSelectedUf] = React.useState('0');
  const [selectedCity, setSelectedCity] = React.useState('0');
  //      Input text data
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  //  import { Link, useHistory } from 'react-router-dom';
  const history = useHistory();
  
  // USE EFFECTS
  // Load Items
  React.useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data);
    });
  }, []);

  // Load Initial Position on Map
  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  // Load IBGE uf
  React.useEffect(() => {
    axios
      .get<IBGEufApiResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => {
        const ufLetters = response.data.map(({ sigla }) => sigla);
        setUfs(ufLetters);
      });
  }, []);

  // Load IBGE cidades
  React.useEffect(() => {
    if (selectedUf === '0') return;
    axios
      .get<IGBEcityApiResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then((response) => {
        const cityNames = response.data.map(({ nome }) => nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  // FUNCTIONS
  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.includes(id);
    if (alreadySelected) return setSelectedItems(selectedItems.filter((item) => item !== id));
    return setSelectedItems([...selectedItems, id]);
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  };

  const handleSelectUf = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(event.target.value);
  };

  const handleSelectCity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    await api.post('points', data);

    alert('Ponto de coleta criado!')

    history.push('/');
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleInputChange} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleInputChange} />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={initialPosition} zoom={10} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(({ id, title, image_url }) => (
              <li
                key={id}
                onClick={() => handleSelectItem(id)}
                className={selectedItems.includes(id) ? 'selected' : ''}
              >
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
