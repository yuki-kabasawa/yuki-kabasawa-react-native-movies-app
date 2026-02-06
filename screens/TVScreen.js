import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getTVShows } from '../services/api';
import MediaItem from '../components/MediaItem';
import Dropdown from '../components/Dropdown';
import Pagination from '../components/Pagination';

export default function TVScreen(props) {
  const navigation = props.navigation;

  // State: list of TV shows
  const [tvShows, setTVShows] = useState([]);

  // State: selected category
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // State: loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // State: current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Categories for the dropdown
  const categories = [
    { label: 'Airing Today', value: 'airing_today' },
    { label: 'On The Air', value: 'on_the_air' },
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' }
  ];

  // Fetch TV shows when component loads or category changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when category changes
    fetchTVShowsFromAPI();
  }, [selectedCategory]);

  async function fetchTVShowsFromAPI() {
    setIsLoading(true);
    try {
      const data = await getTVShows(selectedCategory);
      setTVShows(data.results);
    } catch (error) {
      console.error('Failed to fetch TV shows:', error);
    }
    setIsLoading(false);
  }

  function renderTVShowItem(itemData) {
    return (
      <MediaItem
        item={itemData.item}
        mediaType="tv"
        navigation={navigation}
      />
    );
  }

  // Pagination logic: 10 items per page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tvShows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTVShows = tvShows.slice(startIndex, endIndex);

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
        data={paginatedTVShows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTVShowItem}
        refreshing={isLoading}
        onRefresh={fetchTVShowsFromAPI}
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
