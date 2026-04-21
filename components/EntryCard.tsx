import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entry, Item } from "../types";

type Props = {
  entry: Entry;
  item?: Item;
  onDelete: () => void;
  onEdit: () => void;
};

export default function EntryCard({ entry, item, onDelete, onEdit }: Props) {

  const total = (item?.pricePerUnit || 0) * entry.quantity;

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>
          {item?.name} - {entry.quantity} {item?.unit}
        </Text>

        <Text style={styles.date}>
          ₹ {total} • {new Date(entry.date).toDateString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12, color: "#777" },
  actions: { justifyContent: "space-between" },
  edit: { color: "#2196F3", marginBottom: 6 },
  delete: { color: "#f44336" },
});