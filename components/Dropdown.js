import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function Dropdown(props) {
  const containerStyle = props.containerStyle || {};
  const pickerBoxStyle = props.pickerBoxStyle || {};

  return (
    <View style={[styles.container, containerStyle]}>
      {props.label ? <Text style={styles.label}>{props.label}</Text> : null}
      <View style={[styles.pickerBox, pickerBoxStyle]}>
        <RNPickerSelect
          onValueChange={props.onValueChange}
          items={props.items}
          value={props.value}
          style={props.customPickerStyles || pickerStyles}
          placeholder={{}}
          useNativeAndroidPickerStyle={false}
          Icon={() => <Text style={styles.arrow}>▼</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
  },
});

const pickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30,
    color: 'black',
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingRight: 30,
    color: 'black',
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
});
