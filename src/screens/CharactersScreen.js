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

  // Paginación
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pull to refresh: estado propio para no esconder la lista mientras se actualiza.
  const [refreshing, setRefreshing] = useState(false);

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
        setPage(1);
        setHasNextPage(data.hasNextPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFirstPage();
  }, [reloadKey]);

  async function loadMore() {
    // No tiene sentido pedir más si ya hay una carga en curso, si la API dijo
    // que no hay página siguiente o si quedó un error pendiente.
    if (loading || loadingMore || refreshing || !hasNextPage || error) return;

    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await getCharacters({ page: nextPage });
      // Arreglo nuevo con los anteriores + los nuevos (no se modifica el anterior).
      setCharacters((current) => [...current, ...data.results]);
      setPage(nextPage);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      // Se guarda el error sin borrar los personajes ya cargados.
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRefresh() {
    // Si se está cargando la página siguiente, se espera a que termine.
    if (loading || loadingMore) return;

    setRefreshing(true);
    setError(null);
    try {
      const data = await getCharacters({ page: 1 });
      // Se reemplaza toda la lista y se reinicia la paginación.
      setCharacters(data.results);
      setPage(1);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  function handleRetry() {
    setReloadKey((current) => current + 1);
  }

  function renderFooter() {
    if (loadingMore) {
      return <ActivityIndicator style={styles.footer} color={COLORS.primary} />;
    }
    if (error && characters.length > 0) {
      return <Text style={styles.footerError}>{error}</Text>;
    }
    return null;
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
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
