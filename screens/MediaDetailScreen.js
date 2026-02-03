import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { getMovieDetails, getTVDetails } from '../services/api';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MediaDetailScreen(props) {
  const navigation = props.navigation;
  const route = props.route;
  const { id, mediaType, title: paramTitle } = route.params || {};

  // State: the movie or TV show data
  const [mediaData, setMediaData] = useState(null);

  // State: loading indicator
  const [isLoading, setIsLoading] = useState(true);

  // Set initial title from params if available, otherwise 'Loading...' or 'Details'
  useLayoutEffect(() => {
    navigation.setOptions({
      title: paramTitle || 'Details',
      headerStyle: { backgroundColor: '#fff' },
      headerTintColor: '#007AFF', // Blue back button
      headerTitleStyle: { color: '#000', fontWeight: 'bold' },
      headerBackTitle: 'Back to List',
    });
  }, [navigation, paramTitle]);

  // Update title once data is loaded
  useEffect(() => {
    if (mediaData) {
      const newTitle = mediaData.title || mediaData.name;
      navigation.setOptions({
        title: newTitle,
        headerBackTitle: 'Back to List'
      });
    }
  }, [navigation, mediaData]);

  // Fetch details when component loads
  useEffect(() => {
    fetchDetails();
  }, []);

  async function fetchDetails() {
    setIsLoading(true);
    try {
      let data;
      if (mediaType === 'movie') {
        data = await getMovieDetails(id);
      } else {
        data = await getTVDetails(id);
      }
      setMediaData(data);
    } catch (error) {
      console.error('Failed to fetch details:', error);
    }
    setIsLoading(false);
  }

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show error if fetch failed
  if (!mediaData) {
    return (
      <View style={styles.centerBox}>
        <Text>Failed to load details</Text>
      </View>
    );
  }

  // Extract data from mediaData
  const title = mediaData.title || mediaData.name || 'Untitled';
  const releaseDate = mediaData.release_date || mediaData.first_air_date;
  const hasPoster = mediaData.poster_path !== null;
  const posterUrl = hasPoster ? IMAGE_BASE_URL + mediaData.poster_path : null;
  const popularity = mediaData.popularity ? mediaData.popularity.toFixed(3) : 'N/A';
  const overview = mediaData.overview || 'No overview available.';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <Text style={styles.title}>{title}</Text>

      {hasPoster ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <Text style={styles.overview}>{overview}</Text>

      <Text style={styles.footerText}>
        Popularity: {popularity} | Release Date: {releaseDate || 'N/A'}
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  poster: {
    width: 250,
    height: 250,
    marginBottom: 24,
    resizeMode: 'cover', // Or contain? Screenshot shows square-ish
    // Screenshot 3 looks like square or slightly portrait. 
  },
  posterPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 24,
    textAlign: 'left',
    width: '100%',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
