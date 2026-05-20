import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getHewanById } from '../services/api';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [Hewan, setHewan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    setLoading(true);
    const response = await getHewanById(id);
    setLoading(false);

    if (response.status === 200 && response.data) {
      setHewan(response.data.data);
    } else {
      Alert.alert('Error', response.message || 'Gagal mengambil detail');
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const getJenisName = (type) => {
    if (type === '1') return 'Sapi';
    if (type === '2') return 'Domba';
    if (type === '3') return 'Kambing';
    return '-';
  };

  const getPricePerBerat = (type) => {
    if (type === '1') return 'Rp 10000 / kg';
    if (type === '2') return 'Rp 7500 / kg';
    if (type === '3') return 'Rp 6000 / kg';
    return '-';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!Hewan) {
    return (
      <View style={styles.center}>
        <Text>Data tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{Hewan.pemilikHewan}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Jenis Hewan</Text>
          <Text style={styles.value}>{getJenisName(Hewan.jenisHewan)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Lokasi</Text>
          <Text style={styles.value}>{Hewan.kandangHewan}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Berat</Text>
          <Text style={styles.value}>{Hewan.beratHewan} kg</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Harga per KG</Text>
          <Text style={styles.value}>{getPricePerBerat(Hewan.jenisHewan)}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Harga</Text>
          <Text style={styles.priceValue}>Rp {Hewan.hargaHewan?.toLocaleString()}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: { fontSize: 16, color: '#7f8c8d' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  priceContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#3498db',
    alignItems: 'center',
  },
  priceLabel: { fontSize: 18, color: '#7f8c8d' },
  priceValue: { fontSize: 32, fontWeight: 'bold', color: '#3498db', marginTop: 5 },
});