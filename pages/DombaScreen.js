import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { getHewansByCategory, deleteHewan } from '../services/api';

export default function DombaScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const response = await getHewansByCategory('domba');
    if (response.status === 200 && response.data) {
      setData(response.data.data || []);
    } else {
      Alert.alert('Error', response.message || 'Gagal mengambil data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDelete = (id, name) => {
    Alert.alert('Hapus', `Hapus "${name}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const response = await deleteHewan(id);
          if (response.status === 200) {
            Alert.alert('Berhasil', 'Data berhasil dihapus');
            fetchData();
          } else {
            Alert.alert('Gagal', response.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{item.pemilikHewan}</Text>
          <Text style={styles.location}>{item.kandangHewan}</Text>
          <Text style={styles.area}>{item.beratHewan} kg</Text>
        </View>
        <View>
          <Text style={styles.price}>Rp {item.hargaHewan?.toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id, item.pemilikHewan)}
      >
        <Text style={styles.deleteText}>Hapus</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada data domba</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#FE9276' },
  location: { color: '#666', marginTop: 5 },
  area: { color: '#999', fontSize: 12, marginTop: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  deleteBtn: { alignSelf: 'flex-end', paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#e74c3c', borderRadius: 5 },
  deleteText: { color: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});