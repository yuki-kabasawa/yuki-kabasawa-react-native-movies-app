import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MediaItem(props) {
  const item = props.item;
  const mediaType = props.mediaType;
  const navigation = props.navigation;

  // Get title (movies have 'title', TV shows have 'name')
  const title = item.title || item.name;

  // Get release date
  const releaseDate = item.release_date || item.first_air_date;

  // Get poster image URL
  const hasPoster = item.poster_path !== null;
  const posterUrl = hasPoster ? IMAGE_BASE_URL + item.poster_path : null;

  // Get popularity
  const popularity = item.popularity ? item.popularity.toFixed(1) : 'N/A';

  function handlePress() {
    // Figure out if this is a movie or TV show
    let finalMediaType = mediaType;
    if (mediaType === 'multi') {
      finalMediaType = item.media_type;
    }

    // Skip if it's a person (we only support movies and TV shows)
    if (finalMediaType === 'person') {
      return;
    }

    // Navigate to detail screen with the ID
    navigation.navigate('Detail', {
      id: item.id,
      mediaType: finalMediaType,
      title: title
    });
  }

  return (
    <View style={styles.container}>
      {hasPoster ? (
        <Image source={{ uri: posterUrl }} style={styles.poster} />
      ) : (
        <View style={styles.posterPlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.popularity}>Popularity: {popularity}</Text>
          <Text style={styles.releaseDate}>Release Date: {releaseDate || 'N/A'}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>More Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  poster: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  posterPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
    height: 100,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  popularity: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  releaseDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#00b4d8',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});
