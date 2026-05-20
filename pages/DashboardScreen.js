import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput, Modal } from 'react-native';
import { getAllHewans, createHewan } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ 
    sapiCount: 0, 
    dombaCount: 0, 
    kambingCount: 0, 
    sapiTotalPrice: 0, 
    dombaTotalPrice: 0, 
    kambingTotalPrice: 0 
});
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    pemilikHewan: '',
    jenisHewan: '1',
    beratHewan: '',
    kandangHewan: '',
  });

  const fetchData = async () => {
    try {
      const response = await getAllHewans();
      console.log('API Response:', JSON.stringify(response, null, 2));
      
      if (response.status === 200 && response.data) {
        let hewanData = [];
        let statsData = {};
        
        if (response.data.data && Array.isArray(response.data.data)) {
          hewanData = response.data.data;
          statsData = response.data.stats || {};
          setTotal(response.data.total || hewanData.length);
        } else if (Array.isArray(response.data)) {
          hewanData = response.data;
          statsData = calculateStats(hewanData);
          setTotal(hewanData.length);
        } else if (response.data.data && Array.isArray(response.data.data.data)) {
          hewanData = response.data.data.data;
          statsData = response.data.data.stats || {};
          setTotal(response.data.data.total || hewanData.length);
        } else {
          hewanData = [];
          statsData = {};
          setTotal(0);
        }
        
        setData(hewanData);
        setStats({
          sapiCount: statsData.sapiCount || 0,
          dombaCount: statsData.dombaCount || 0,
          kambingCount: statsData.kambingCount || 0,
          sapiTotalPrice: statsData.sapiTotalPrice || 0,
          dombaTotalPrice: statsData.dombaTotalPrice || 0,
          kambingTotalPrice: statsData.kambingTotalPrice || 0,
        });
      } else {
        console.log('Response error:', response);
        Alert.alert('Error', response.message || 'Gagal mengambil data');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Terjadi kesalahan koneksi');
    }
  };

  const calculateStats = (hewans) => {
    const stats = {
      sapiCount: 0,
      dombaCount: 0,
      kambingCount: 0,
      sapiTotalPrice: 0,
      dombaTotalPrice: 0,
      kambingTotalPrice: 0,
    };
    
    hewans.forEach((item) => {
      if (item.jenisHewan === '1') {
        stats.sapiCount++;
        stats.sapiTotalPrice += item.harga || 0;
      } else if (item.jenisHewan === '2') {
        stats.dombaCount++;
        stats.dombaTotalPrice += item.harga || 0;
      } else if (item.jenisHewan === '3') {
        stats.kambingCount++;
        stats.kambingTotalPrice += item.harga || 0;
      }
    });
    
    return stats;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('username');
            console.log('Logout success');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  const handleCreate = async () => {
    if (!form.pemilikHewan || !form.jenisHewan || !form.beratHewan || !form.kandangHewan) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    setLoading(true);
    const response = await createHewan({
      pemilikHewan: form.pemilikHewan,
      jenisHewan: form.jenisHewan,
      beratHewan: parseFloat(form.beratHewan),
      kandangHewan: form.kandangHewan,
    });
    setLoading(false);

    if (response.status === 201) {
      Alert.alert('Berhasil', 'Data berhasil ditambahkan');
      setModalVisible(false);
      setForm({ pemilikHewan: '', jenisHewan: '1', beratHewan: '', kandangHewan: '' });
      fetchData();
    } else {
      Alert.alert('Gagal', response.message);
    }
  };

  const StatCard = ({ title, count, totalPrice, color, screen }) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: color }]}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statCount}>{count} ekor</Text>
      <Text style={styles.statPrice}>Rp {totalPrice?.toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsContainer}>
            <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Hewan</Text>
                <Text style={styles.totalValue}>{total}</Text>
            </View>

            <View style={styles.totalAssetsCard}>
                <Text style={styles.totalLabel}>Total Aset</Text>
                <Text style={styles.totalValue}>Rp {stats.sapiTotalPrice + stats.dombaTotalPrice + stats.kambingTotalPrice}</Text>
            </View>

            <View style={styles.jenisTerbanyakCard}>
                <Text style={styles.totalLabel}>Jenis Terbanyak</Text>
                <Text style={styles.totalValue}>
                    {(() => {
                        const maxCount = Math.max(stats.sapiCount, stats.dombaCount, stats.kambingCount);
                        if (maxCount === stats.sapiCount) return 'Sapi';
                        if (maxCount === stats.dombaCount) return 'Domba';
                        return 'Kambing';
                    })()}
                </Text>
            </View>
        </View>

        <Text style={styles.sectionTitle}>Kategori Hewan</Text>
        <View style={styles.statsContainer}>
          <StatCard
            title="Sapi"
            count={stats.sapiCount}
            totalPrice={stats.sapiTotalPrice}
            color="#51A9FF"
            screen="Sapi"
          />
          <StatCard
            title="Domba"
            count={stats.dombaCount}
            totalPrice={stats.dombaTotalPrice}
            color="#FE9276"
            screen="Domba"
          />
          <StatCard
            title="Kambing"
            count={stats.kambingCount}
            totalPrice={stats.kambingTotalPrice}
            color="#CAEEFB"
            screen="Kambing"
          />
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Data</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Daftar Hewan</Text>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          >
            <View>
              <Text style={styles.itemName}>{item.pemilikHewan}</Text>
              <Text style={styles.itemLocation}>{item.kandangHewan}</Text>
            </View>
            <View>
              <Text style={styles.itemPrice}>Rp {item.hargaHewan?.toLocaleString()}</Text>
              <Text style={styles.itemWeight}>{item.beratHewan} kg</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Hewan</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nama Pemilik Hewan"
              value={form.pemilikHewan}
              onChangeText={(text) => setForm({ ...form, pemilikHewan: text })}
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[styles.typeBtn, form.jenisHewan === '1' && styles.typeActive]}
                onPress={() => setForm({ ...form, jenisHewan: '1' })}
              >
                <Text style={form.jenisHewan === '1' ? styles.typeActiveText : styles.typeText}>
                  Sapi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, form.jenisHewan === '2' && styles.typeActive]}
                onPress={() => setForm({ ...form, jenisHewan: '2' })}
              >
                <Text style={form.jenisHewan === '2' ? styles.typeActiveText : styles.typeText}>
                    Domba
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, form.jenisHewan === '3' && styles.typeActive]}
                onPress={() => setForm({ ...form, jenisHewan: '3' })}
              >
                <Text style={form.jenisHewan === '3' ? styles.typeActiveText : styles.typeText}>
                  Kambing
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Kandang"
              value={form.kandangHewan}
              onChangeText={(text) => setForm({ ...form, kandangHewan: text })}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Berat Hewan"
              keyboardType="numeric"
              value={form.beratHewan}
              onChangeText={(text) => setForm({ ...form, beratHewan: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleCreate}
                disabled={loading}
              >
                <Text style={styles.saveBtnText}>{loading ? 'Menyimpan...' : 'Simpan'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' }, 
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
    logoutText: { color: '#e74c3c', fontWeight: 'bold' },
    totalCard: { backgroundColor: '#51A9FF', margin: 15, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
    totalLabel: { fontSize: 16, color: '#666' },
    totalValue: { fontSize: 28, fontWeight: 'bold', color: '#fcfcfc' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginHorizontal: 15, marginTop: 20 },
    statsContainer: { flexDirection: 'row', flexDirection:"column", justifyContent: 'space-between', marginHorizontal: 15 },
    statCard: { flex: 1, margin: 5, padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
    statTitle: { fontSize: 16, color: '#fff', marginBottom: 10 },
    statCount: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    statPrice: { fontSize: 14, color: '#fff', marginTop: 5 },
    addButton: { backgroundColor: '#3498db', margin: 15, padding: 15, borderRadius: 10, alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    itemCard: { backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 5, padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    itemLocation: { color: '#666', marginTop: 5 },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
    itemWeight: { color: '#999', fontSize: 12, marginTop: 5 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20, textAlign: 'center' },
    modalInput: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15 },
    typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    typeBtn: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#f5f5f5' },
    typeActive: { backgroundColor: '#3498db' },
    typeText: { color: '#666' },
    typeActiveText: { color: '#fff', fontWeight: 'bold' },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginLeft: 10 },
    cancelBtn: { backgroundColor: '#e74c3c' },
    cancelBtnText: { color: '#fff', fontWeight: 'bold' },
    saveBtn: { backgroundColor: '#2ecc71' },
    saveBtnText: { color: '#fff', fontWeight: 'bold' },
    totalAssetsCard: { backgroundColor: '#FE9276', margin: 15, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
    jenisTerbanyakCard: { backgroundColor: '#CAEEFB', margin: 15, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
});