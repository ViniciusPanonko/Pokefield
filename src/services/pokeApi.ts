import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/'
});

export const fetchPokemonList = async (limit = 50, offset = 0) => {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchPokemonDetails = async (nameOrId: string | number) => {
  const response = await api.get(`/pokemon/${nameOrId}`);
  return response.data;
};

export const fetchMoveDetails = async (moveUrl: string) => {
  const response = await axios.get(moveUrl);
  return response.data;
};

export const fetchNatureDetails = async (name: string) => {
  const response = await api.get(`/nature/${name}`);
  return response.data;
};

// --- GRAPHQL ---

const GQL_URL = 'https://beta.pokeapi.co/graphql/v1beta';

export const fetchAllPokemonGraphQL = async () => {
  const query = `
    query PokedexGlobalQuery {
      pokemon_v2_pokemon(limit: 2000) {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
        pokemon_v2_pokemonabilities {
          is_hidden
          pokemon_v2_ability {
            name
          }
        }
      }
    }
  `;

  const response = await axios.post(GQL_URL, { query });
  return response.data.data.pokemon_v2_pokemon;
};

export const fetchPokemonDetailedGraphQL = async (id: number | string) => {
  const query = `
    query PokedexDetail {
      pokemon_v2_pokemon(where: {id: {_eq: ${id}}}) {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
        pokemon_v2_pokemonabilities {
          is_hidden
          pokemon_v2_ability {
            name
          }
        }
        pokemon_v2_pokemonmoves(where: {pokemon_v2_move: {power: {_gt: 0}}}) {
          pokemon_v2_move {
            name
            power
            accuracy
            pokemon_v2_type {
              name
            }
            pokemon_v2_moveflavortexts(where: {language_id: {_in: [9, 13]}}) {
              language_id
              flavor_text
            }
          }
        }
      }
    }
  `;
  const response = await axios.post(GQL_URL, { query });
  
  // A PokeAPI can return multiple same moves learned at different levels. We will distinct them.
  const rawMoves = response.data.data.pokemon_v2_pokemon[0].pokemon_v2_pokemonmoves;
  const uniqueMovesMap = new Map();
  
  rawMoves.forEach((m: any) => {
    const moveInfo = m.pokemon_v2_move;
    if (!uniqueMovesMap.has(moveInfo.name)) {
      
      const texts = moveInfo.pokemon_v2_moveflavortexts || [];
      const ptText = texts.find((t: any) => t.language_id === 13);
      const enText = texts.find((t: any) => t.language_id === 9);
      
      let flavor = ptText ? ptText.flavor_text : (enText ? enText.flavor_text : "No description available.");
      flavor = flavor.replace(/\n|\f|\r/g, ' ');

      uniqueMovesMap.set(moveInfo.name, {
        name: moveInfo.name.replace('-', ' '),
        power: moveInfo.power,
        accuracy: moveInfo.accuracy,
        type: moveInfo.pokemon_v2_type.name,
        flavor_text: flavor
      });
    }
  });

  return {
    ...response.data.data.pokemon_v2_pokemon[0],
    unique_moves: Array.from(uniqueMovesMap.values())
  };
};
