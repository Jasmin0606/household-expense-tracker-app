import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import { useStore } from "../../store/useStore";

export default function ItemsScreen() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");

  const items = useStore((s) => s.items);
  const addItem = useStore((s) => s.addItem);

  const handleAdd = () => {
    if (!name) return;

    addItem({
      id: Date.now().toString(),
      name,
      unit,
      pricePerUnit: price ? Number(price) : 0,

    });

    setName("");
    setUnit("");
    setPrice("");

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item</Text>

      <AppInput
        placeholder="Item name (Milk)"
        value={name}
        onChangeText={setName}
      />

      <AppInput
        placeholder="Unit (litre, kg)"
        value={unit}
        onChangeText={setUnit}
      />

      <AppInput
        placeholder="Price per unit (₹)"
        value={price}
        onChangeText={setPrice}
      />

      <AppButton title="Add Item" onPress={handleAdd} />

      <Text style={styles.subtitle}>Your Items</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemText}>
              {item.name} ({item.unit}) - ₹{item.pricePerUnit || 0}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop:50, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  subtitle: { marginTop: 20, fontSize: 16, fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  itemText: { fontSize: 16 },
});