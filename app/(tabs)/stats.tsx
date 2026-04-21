import { Text, View, ScrollView } from "react-native";
import { useStore } from "../../store/useStore";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";


export default function StatsScreen() {
  const entries = useStore((s) => s.entries);
  const items = useStore((s) => s.items);

  const currentMonth = new Date().getMonth();

  const monthlyData = entries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth;
  });

  let totalExpense = 0;

  const summary: Record<string, number> = {};

  const screenWidth = Dimensions.get("window").width;

  
  

  monthlyData.forEach((e) => {
    const item = items.find((i) => i.id === e.itemId);
    const price = item?.pricePerUnit || 0;

    const cost = price * e.quantity;

    totalExpense += cost;

    summary[e.itemId] = (summary[e.itemId] || 0) + cost;
  });

  const labels: string[] = [];
  const data: number[] = [];

Object.keys(summary).forEach((itemId) => {
  const item = items.find((i) => i.id === itemId);

  if (item) {
    labels.push(item.name);
    data.push(summary[itemId]);
  }
});

  return (
    <ScrollView style={{flex:1, padding: 16, paddingTop:50 }}>
      <Text  style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Monthly Usage</Text>

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Total Expense: ₹{totalExpense}
      </Text>

      {Object.keys(summary).map((itemId) => {
        const item = items.find((i) => i.id === itemId);

        return (
          <Text key={itemId}>
            {item?.name}: ₹{summary[itemId]}
          </Text>
        );
      })}


{data.length > 0 && (
  <BarChart
    data={{
      labels,
      datasets: [{ data }],
    }}
    width={screenWidth - 32}
    height={220}
    yAxisLabel="₹"
    chartConfig={{
       backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",

  decimalPlaces: 0,

  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // green bars
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

  barPercentage: 0.6,
    }}
    style={{
      marginTop: 20,
      borderRadius: 10,
    }}
  />
)}

    </ScrollView>
  );
}