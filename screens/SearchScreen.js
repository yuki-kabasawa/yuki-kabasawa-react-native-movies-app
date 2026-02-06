import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchMedia } from '../services/api';
import MediaItem from '../components/MediaItem';
import Dropdown from '../components/Dropdown';
import Pagination from '../components/Pagination';

export default function SearchScreen(props) {
  const navigation = props.navigation;

  // State: what the user typed
  const [searchText, setSearchText] = useState('');

  // State: search results
  const [results, setResults] = useState([]);

  // State: search type (movie, tv, or multi)
  const [searchType, setSearchType] = useState('multi');

  // State: loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // State: error message
  const [errorMessage, setErrorMessage] = useState('');

  // State: has user searched yet?
  const [hasSearched, setHasSearched] = useState(false);

  // State: validation error for red borders
  const [showValidationError, setShowValidationError] = useState(false);

  // State: current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Search types for the dropdown
  const searchTypes = [
    { label: 'Multi', value: 'multi' },
    { label: 'Movie', value: 'movie' },
    { label: 'TV', value: 'tv' }
  ];

  async function performSearch() {
    // Check if search box is empty
    if (searchText.trim() === '') {
      setErrorMessage('Movie/TV show name is required');
      setShowValidationError(true);
      return;
    }

    // Clear any previous error
    setErrorMessage('');
    setShowValidationError(false);
    setIsLoading(true);
    setHasSearched(true);
    setCurrentPage(1); // Reset to page 1 on new search

    try {
      const data = await searchMedia(searchText, searchType);
      setResults(data.results);
    } catch (error) {
      console.error('Failed to search:', error);
      setErrorMessage('Search failed. Please try again.');
    }
    setIsLoading(false);
  }

  function handleTextChange(text) {
    setSearchText(text);
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    if (showValidationError) {
      setShowValidationError(false);
    }
  }

  function renderSearchResult(itemData) {
    const item = itemData.item;
    const type = item.media_type || searchType;

    return (
      <MediaItem
        item={item}
        mediaType={type}
        navigation={navigation}
      />
    );
  }

  function renderEmptyList() {
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.messageBox}>
        <Text style={styles.messageText}>No results found</Text>
      </View>
    );
  }

  // Pagination logic: 10 items per page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.label}>
          Search Movie/TV Show Name<Text style={styles.asterisk}>*</Text>
        </Text>
        <View style={[styles.inputContainer, showValidationError && styles.inputError]}>
          <Ionicons name="search" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="i.e. James Bond, CSI"
            value={searchText}
            onChangeText={handleTextChange}
            onSubmitEditing={performSearch}
          />
        </View>

        <Text style={styles.label}>
          Choose Search Type<Text style={styles.asterisk}>*</Text>
        </Text>
        <View style={styles.row}>
          <View style={styles.dropdownContainer}>
            <Dropdown
              label=""
              value={searchType}
              items={searchTypes}
              onValueChange={setSearchType}
              containerStyle={styles.dropdownCustomContainer}
              pickerBoxStyle={[styles.dropdownCustomPickerBox, showValidationError && styles.dropdownError]}
              customPickerStyles={customPickerStyles}
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={performSearch}>
            <Ionicons name="search" size={20} color="white" style={styles.btnIcon} />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {errorMessage !== '' ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={styles.hintText}>Please select a search type</Text>
        )}
      </View>

      {!hasSearched ? (
        <View style={styles.centerMessage}>
          <Text style={styles.centerMessageText}>Please initiate a search</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSearchResult}
            refreshing={isLoading}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={styles.listContent}
          />
          {results.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBox: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 4,
  },
  asterisk: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: 'red',
  },
  inputIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1, // Take up remaining space
    marginRight: 10,
    // Dropdown internal style might need check but this helps layout
  },
  searchButton: {
    backgroundColor: '#00b4d8', // Cyan/Light Blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    height: 46, // Match height roughly with dropdown if possible
  },
  btnIcon: {
    marginRight: 6,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
  hintText: {
    color: '#666',
    marginTop: 8,
    fontSize: 12,
  },
  centerMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerMessageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  messageBox: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dropdownCustomContainer: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  dropdownCustomPickerBox: {
    height: 46,
    justifyContent: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownError: {
    borderColor: 'red',
  }
});

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    color: 'black',
  },
  iconContainer: {
    top: 14,
    right: 10,
  },
});
