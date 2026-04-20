import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function ReportsScreen() {
    const [unhandledReports, setUnhandledReports] = useState<any>([]);

    setUnhandledReports([
        { id: 1, reportedBy: 'User A', timestamp: '2024-06-01 10:00' },
        { id: 2, reportedBy: 'User B', timestamp: '2024-06-02 14:30' },
    ]);

  return (
    <View>
      <Text>Reports Screen</Text>
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Unhandled Reports</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{ fontWeight: 'bold' }}>Reported By</Text>
        <Text style={{ fontWeight: 'bold' }}>Timestamp</Text>
        <Text style={{ fontWeight: 'bold' }}>Actions</Text>
      </View>
        <FlatList
            data={unhandledReports}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text>Reported by: {item.reportedBy}</Text>
                <Text>Timestamp: {item.timestamp}</Text>
                <TouchableOpacity onPress={() => alert(`Viewing details for report ${item.id}`)}>
                    <Text style={{ color: 'blue' }}>View Details</Text>
                </TouchableOpacity>
            </View>
            )}
        />
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>All Reports</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{ fontWeight: 'bold' }}>Reported By</Text>
        <Text style={{ fontWeight: 'bold' }}>Timestamp</Text>
        <Text style={{ fontWeight: 'bold' }}>Actions</Text>
      </View>
    </View>
  );
}
