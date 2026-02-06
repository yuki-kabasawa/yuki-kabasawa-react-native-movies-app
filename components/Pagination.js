import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Pagination(props) {
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const onPageChange = props.onPageChange;

  // Don't show pagination if only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Page:</Text>
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === currentPage;
        return (
          <TouchableOpacity
            key={pageNumber}
            style={[styles.pageButton, isActive && styles.activeButton]}
            onPress={() => onPageChange(pageNumber)}
          >
            <Text style={[styles.pageText, isActive && styles.activeText]}>
              {pageNumber}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#2c3e50',
    borderColor: '#2c3e50',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeText: {
    color: '#fff',
  },
});
