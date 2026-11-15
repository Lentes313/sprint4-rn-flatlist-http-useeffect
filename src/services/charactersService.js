import { API_BASE_URL } from '../config/constants';

// Contrato que la pantalla espera de esta función:
//
//   getCharacters({ page, name })  →  Promise<{ results, hasNextPage }>
//
//   - page : número de página (por defecto 1)
//   - name : texto a buscar (por defecto vacío = sin filtro)
//   - results     : arreglo de personajes
//   - hasNextPage : true si existe una página siguiente

export async function getCharacters({ page = 1, name = '' } = {}) {
  let url = `${API_BASE_URL}/character?page=${page}`;

  // El filtro solo se agrega si hay texto, codificado para que espacios y acentos no rompan la URL.
  const trimmedName = name.trim();
  if (trimmedName !== '') {
    url += `&name=${encodeURIComponent(trimmedName)}`;
  }

  // Si falla la red, fetch rechaza la promesa y el error sigue hacia la pantalla.
  const response = await fetch(url);

  // La API responde 404 cuando la búsqueda no tiene coincidencias: no es un error, es "sin resultados".
  if (response.status === 404) {
    return { results: [], hasNextPage: false };
  }

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los personajes (código HTTP ${response.status}).`);
  }

  const data = await response.json();

  return {
    results: data.results,
    hasNextPage: data.info.next !== null,
  };
}
