import { Entry } from "@/types";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AppButton from "../../components/AppButton";
import AppDatePicker from "../../components/AppDatePicker";
import AppInput from "../../components/AppInput";
import EntryCard from "../../components/EntryCard";
import { useStore } from "../../store/useStore";

export default function EntryScreen() {
  const items = useStore((s) => s.items);
  const addEntry = useStore((s) => s.addEntry);
  const deleteEntry = useStore((s) => s.deleteEntry);
  const updateEntry = useStore((s) => s.updateEntry);
  const entries = useStore((s) => s.entries);


  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dropdownItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const getDatesInRange = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleSave = () => {
    if (!value || !quantity) return;
    if (editingEntry && isBulkMode) {
      setIsBulkMode(false);
    }

    const baseData = {
      itemId: value,
      quantity: Number(quantity),
      date: date.toISOString(),
    };

    // ✅ EDIT MODE (highest priority)
    if (editingEntry) {
      updateEntry({
        id: editingEntry.id,
        ...baseData,
      });

      setEditingEntry(null);
      return; // ❗ important to stop further execution
    }

    // ✅ BULK MODE
    if (isBulkMode) {
      const dates = getDatesInRange(startDate, endDate);

      dates.forEach((d) => {
        addEntry({
          id: Date.now().toString() + Math.random(),
          itemId: value,
          quantity: Number(quantity),
          date: d.toISOString(),
        });
      });
    } else {
      // ✅ SINGLE ENTRY
      addEntry({
        id: Date.now().toString(),
        ...baseData,
      });
    }

    setQuantity("");
    setValue(null);
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);

    setValue(entry.itemId);
    setQuantity(String(entry.quantity));
    setDate(new Date(entry.date));

    setIsBulkMode(false); // ✅ important

  };

  const handleQuantityChange = (text: string) => {
    // allow only numbers + decimal
    const cleaned = text.replace(/[^0-9.]/g, "");
    setQuantity(cleaned);
  };

  const handleQuickAdd = (qty: number) => {
    if (!value) {
      alert("Select item first");
      return;
    }

    addEntry({
      id: Date.now().toString() + Math.random(),
      itemId: value,
      quantity: qty,
      date: new Date().toISOString(),
    });
  };

  const today = new Date();

  const todayEntries = entries.filter((e) => {
    const d = new Date(e.date);

    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });


  const summary: Record<string, { qty: number; cost: number }> = {};

  todayEntries.forEach((e) => {
    const item = items.find((i) => i.id === e.itemId);
    const price = item?.pricePerUnit || 0;

    if (!summary[e.itemId]) {
      summary[e.itemId] = { qty: 0, cost: 0 };
    }

    summary[e.itemId].qty += e.quantity;
    summary[e.itemId].cost += e.quantity * price;
  });

  const totalExpense = Object.values(summary).reduce(
    (sum, item) => sum + item.cost,
    0
  );

  return (
    <View style={styles.container}>


      {Object.keys(summary).map((itemId) => {
        const item = items.find((i) => i.id === itemId);

        return (
          <Text key={itemId}>
            {item?.name}: {summary[itemId].qty} {item?.unit} → ₹{summary[itemId].cost}
          </Text>
        );
      })}

      <Text style={{ marginTop: 6, fontWeight: "600" }}>
        Total Expense: ₹{totalExpense}
      </Text>

      <Text style={styles.title}>Add Entry</Text>

      <DropDownPicker
        open={open}
        value={value}
        items={dropdownItems}
        setOpen={setOpen}
        setValue={setValue as any}
        placeholder="Select item"
        style={styles.dropdown}
        zIndex={1000}
      />

      <Text style={{ marginBottom: 6, color: value ? "#333" : "#999" }}>
        {value
          ? `Selected: ${items.find(i => i.id === value)?.name}`
          : "Select an item to use quick add"}
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
        <AppButton title="+1" onPress={() => handleQuickAdd(1)} disabled={!value} />
        <AppButton title="+0.5" onPress={() => handleQuickAdd(0.5)} disabled={!value} />
        <AppButton title="+2" onPress={() => handleQuickAdd(2)} disabled={!value} />
      </View>



      <AppButton
        title={isBulkMode ? "Switch to Single Entry" : "Bulk Entry"}
        onPress={() => setIsBulkMode(!isBulkMode)}
      />

      {isBulkMode ? (
        <>
          <Text>Start Date</Text>
          <AppDatePicker date={startDate} onChange={setStartDate} />

          <Text>End Date</Text>
          <AppDatePicker date={endDate} onChange={setEndDate} />
        </>
      ) : (
        <AppDatePicker date={date} onChange={setDate} />
      )}

      <AppInput
        placeholder="Quantity (liters)"
        value={quantity}
        keyboardType="decimal-pad"
        onChangeText={handleQuantityChange}
        maxLength={5}
      />

      <AppButton
        title={editingEntry ? "Update Entry" : "Add Entry"}
        onPress={handleSave}
      />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const entryItem = items.find((i) => i.id === item.itemId);

          return (
            <EntryCard
              entry={item}
              item={entryItem}
              onDelete={() => deleteEntry(item.id)}
              onEdit={() => handleEdit(item)}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  dropdown: {
    borderColor: "#ddd",
    marginBottom: 12,
  },
});

