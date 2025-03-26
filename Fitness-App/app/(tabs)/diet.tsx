
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function DietTracker() {
  const [calories, setCalories] = useState<(string | null)[]>(Array(14).fill(null)); // 14 days - calories is an array of strings or null.
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // selectedDay can be number or null.
  const [inputCalories, setInputCalories] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  const [caloriesGoal, setCaloriesGoal] = useState<string>('');
  const [inputCaloriesGoal, setInputCaloriesGoal]= useState<string>(''); // Initializing Goal Calories
  const [modalGoalVisible, setModalGoalVisible] = useState(false);

  const handleDayPress = (index: number) => {
    setSelectedDay(index);
    setInputCalories(calories[index] || '');
    setModalVisible(true);
  };
  // Function that insert values into the selected Array
  const handleSave = () => {
    if (selectedDay !== null) { // Check for valid index
      const newCalories = [...calories];
      newCalories[selectedDay] = inputCalories;
      setCalories(newCalories);
    }
    setModalVisible(false);
  };

  // Function to Calculate Total Calories. 
  const getTotalCalories = () => {
    return calories
      .filter((cal) => cal !== null && cal !== '') // Remove empty values
      .reduce((sum, cal) => sum + Number(cal), 0); // Convert to number and sum
  };

  // Function to handle Goal of Calories
  const handleGoalPress = () => {
    setInputCaloriesGoal(caloriesGoal || '');
    setModalGoalVisible(true);
  };
  const handleGoalSave = () => {
    setCaloriesGoal(inputCaloriesGoal);
    setModalGoalVisible(false);
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="heart.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Step 2 - Diet Tracking</ThemedText>
      </ThemedView>
      
      <TouchableOpacity
        style={{
          backgroundColor:'#ddd',
          padding: 20,
          margin: 5,
          borderRadius: 10,
          alignItems: 'center',
          width: '100%', // Adjust width for better spacing
        }} 
        onPress={() => handleGoalPress()} // Function that calls the Modal
      >
        <Text style={styles.title}>
          Your goal is: {caloriesGoal ? `${caloriesGoal} kcal` : 'Not set'}  
        </Text>
      </TouchableOpacity>


      {/* This Modal is used to insert the Goal of calories */}
      <Modal visible={modalGoalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            <Text>Enter your Calories Goal</Text>
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Calories"
              value={inputCaloriesGoal}
              onChangeText={setInputCaloriesGoal}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
            <TouchableOpacity style={styles.button} onPress={handleGoalSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCancel}  onPress={() => setModalGoalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={styles.textParagraph}>Set your Calories Goal.</Text>
      <View style={styles.hr} />
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f8f8f8' }}>

      {/* Creating a List with all the components of the Array */}
      <FlatList
        data={Array.from({ length: 14 }, (_, i) => i + 1)}
        numColumns={4} // Display as a grid (7 days per row)
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={{
              backgroundColor: calories[index] ? '#198754' : '#ddd',
              padding: 20,
              margin: 5,
              borderRadius: 10,
              alignItems: 'center',
              width: 68, // Adjust width for better spacing
            }}
            onPress={() => handleDayPress(index)}
          >
            <Text style={{ fontWeight: 'bold', color: calories[index] ? 'white' : 'black' }}>
               Day  {' '+ item} {calories[index] && <Text>{calories[index]} kcal</Text>}
            </Text>
            
          </TouchableOpacity>
        )}
      />
      {/* This Modal is used to insert the numbers of calories by the user */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            <Text>Enter Calories for Day {(selectedDay ?? 0) + 1}</Text>
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Calories"
              value={inputCalories}
              onChangeText={setInputCalories}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                marginBottom: 10,
              }}
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonCancel}  onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    <Text style={styles.textParagraph}>Insert the calories you eat each day.</Text>
    <View style={styles.hr} />
    <View
    style={{
      backgroundColor:'#ddd',
      padding: 20,
      margin: 5,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%', // Adjust width for better spacing
    }} 
    >
      <Text style={styles.title}>
        Total Calories: {getTotalCalories()} kcal   
      </Text>
    </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textParagraph: {
    color: "gray",
    fontWeight:500,
    fontSize: 20,
    textAlign:"center"
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10, // Espaciado arriba y abajo
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:5
  },
  buttonCancel: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
