export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
  state?: number;
}

export const AllowedStatesOptions = [
  {
    value: 1,
    text: 'Ingresada'
  },
  {
    value: 2,
    text: 'Codificar'
  },
  {
    value: 3,
    text: 'Autorizar'
  },
  {
    value: 4,
    text: 'En Revisión'
  },
  {
    value: 5,
    text: 'Autorizada'
  },
  {
    value: 6,
    text: 'Abonar'
  },
  {
    value: 7,
    text: 'Abonada'
  },
  {
    value: 8,
    text: 'Rechazada'
  },
  {
    value: 9,
    text: 'Eliminada'
  }
];
