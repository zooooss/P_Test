import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function App() {
  const [colors, setColors] = useState([]);
  const SHEET_URL =
    'https://docs.google.com/spreadsheets/d/1oJZmTKLeDjLaBN1N17BNGW4f6XINL9jowCnZgPq4QO0/gviz/tq?tqx=out:json&sheet=Data';

  const fetchData = async () => {
    try {
      const response = await fetch(SHEET_URL);
      const text = await response.text();

      // JSON 부분만 추출
      const match = text.match(
        /google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/,
      );
      if (!match || !match[1]) throw new Error('JSON 파싱 실패');

      const json = JSON.parse(match[1]);
      const rows = json.table.rows
        .map(row => (row.c[1] ? row.c[1].v : null)) // B열 값만
        .filter(v => v != null);

      setColors(rows);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {colors.map((color, index) => (
            <Text key={index} style={styles.text}>
              {color}
            </Text>
          ))}
          <View style={{ marginTop: 10 }}>
            <Button title="Refresh" onPress={fetchData} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  box: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});
