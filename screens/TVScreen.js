import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getTVShows } from '../services/api';
import MediaItem from '../components/MediaItem';
import Dropdown from '../components/Dropdown';

export default function TVScreen(props) {
  const navigation = props.navigation;

  // State: list of TV shows
  const [tvShows, setTVShows] = useState([]);

  // State: selected category
  const [selectedCategory, setSelectedCategory] = useState('popular');

  // State: loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Categories for the dropdown
  const categories = [
    { label: 'Airing Today', value: 'airing_today' },
    { label: 'On The Air', value: 'on_the_air' },
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' }
  ];

  // Fetch TV shows when component loads or category changes
  useEffect(() => {
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
        data={tvShows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTVShowItem}
        refreshing={isLoading}
        onRefresh={fetchTVShowsFromAPI}
        contentContainerStyle={styles.listContent}
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
