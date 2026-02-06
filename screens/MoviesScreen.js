import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getMovies } from '../services/api';
import MediaItem from '../components/MediaItem';
import Dropdown from '../components/Dropdown';
import Pagination from '../components/Pagination';

export default function MoviesScreen(props) {
  const navigation = props.navigation;

  // State: list of movies
  const [movies, setMovies] = useState([]);

  // State: selected category
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // State: loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // State: current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Categories for the dropdown
  const categories = [
    { label: 'Now Playing', value: 'now_playing' },
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' },
    { label: 'Upcoming', value: 'upcoming' }
  ];

  // Fetch movies when component loads or category changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when category changes
    fetchMoviesFromAPI();
  }, [selectedCategory]);

  async function fetchMoviesFromAPI() {
    setIsLoading(true);
    try {
      const data = await getMovies(selectedCategory);
      setMovies(data.results);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
    setIsLoading(false);
  }

  function renderMovieItem(itemData) {
    return (
      <MediaItem
        item={itemData.item}
        mediaType="movie"
        navigation={navigation}
      />
    );
  }

  // Pagination logic: 10 items per page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = movies.slice(startIndex, endIndex);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Dropdown
          label="Category:"
          value={selectedCategory}
          items={categories}
          onValueChange={setSelectedCategory}
          containerStyle={styles.dropdownCustomContainer}
        />
      </View>
      <FlatList
        data={paginatedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        refreshing={isLoading}
        onRefresh={fetchMoviesFromAPI}
        contentContainerStyle={styles.listContent}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  dropdownCustomContainer: {
    backgroundColor: 'transparent',
  },
});
