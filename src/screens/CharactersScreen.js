import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';
import { getCharacters } from '../services/charactersService';
import CharacterCard from '../components/CharacterCard';
import StateMessage from '../components/StateMessage';

// Estilos disponibles: container, title, input, loader, separator, listContent, footer, footerError

// Definidos fuera de la pantalla para que no se vuelvan a crear en cada render.
function ItemSeparator() {
  return <View style={styles.separator} />;
}

function EmptyList() {
  return <StateMessage message="No hay personajes que mostrar." />;
}

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Contador que cambia al presionar "Reintentar" para volver a ejecutar el efecto de carga.
  const [reloadKey, setReloadKey] = useState(0);

  // Carga inicial: al montar la pantalla y cada vez que cambia reloadKey.
  useEffect(() => {
    // La función del efecto no puede ser async (debe devolver nada o una limpieza),
    // así que la petición va en una función async interna.
    async function loadFirstPage() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCharacters({ page: 1 });
        setCharacters(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFirstPage();
  }, [reloadKey]);

  function handleRetry() {
    setReloadKey((current) => current + 1);
  }

  let content;
  if (loading) {
    content = <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  } else if (error && characters.length === 0) {
    content = <StateMessage message={error} actionLabel="Reintentar" onAction={handleRetry} />;
  } else {
    content = (
      <FlatList
        data={characters}
        renderItem={({ item }) => <CharacterCard character={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty</Text>

      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  loader: { marginTop: 40 },
  separator: { height: 10 },
  listContent: { paddingBottom: 24 },
  footer: { marginVertical: 16 },
  footerError: { color: COLORS.danger, textAlign: 'center', marginVertical: 16 },
});
