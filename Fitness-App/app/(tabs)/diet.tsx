// Libraries and components
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Collapsible } from '@/components/Collapsible';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { saveData, getData } from '../storage/storageService';  // Import storage functions


export default function DietTracker() {
  // Calories variables
  const [calories, setCalories] = useState<(string | null)[]>(Array(14).fill(null)); // 14 days - calories is an array of strings or null.
  const [caloriesGoal, setCaloriesGoal] = useState<string>(''); // Goal of calories
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // selectedDay can be number or null.
  const [inputCalories, setInputCalories] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  // Goal Calories variables
  const [inputCaloriesGoal, setInputCaloriesGoal]= useState<string>(''); // Initializing Goal Calories
  const [modalGoalVisible, setModalGoalVisible] = useState(false);
  // Routine info
  const [routineName, setRoutineName] = useState(null);
  const [routineCalories, setRoutineCalories] = useState(null);
  // Minutes
  const [routineTime, setRoutineTime] = useState<(string | null)[]>(Array(14).fill(null)); // 14 days - calories is an array of strings or null.
  const [selectedRoutineDay, setSelectedRoutineDay] = useState<number | null>(null); // selectedDay can be number or null.
  const [inputRoutineTime, setInputRoutineTime] = useState<string>('');
  const [modalVisibleTime, setModalVisibleTime] = useState(false);

  // Function that Loads calories and routine from datbase
  const loadStoredData = async () => {
    const storedCalories = await getData('caloriesData');
    const storedGoal = await getData('caloriesGoal');
    const storedRoutine = await getData('routineData');
    const storedRoutineTime = await getData('routineTimeData');
    if (storedCalories) setCalories(storedCalories);
    if (storedGoal) setCaloriesGoal(storedGoal);
    if (storedRoutine) {
      setRoutineName(storedRoutine.title);
      setRoutineCalories(storedRoutine.calories);
    };
    if (storedRoutineTime) setRoutineTime((storedRoutineTime));
      
  };

  // Load stored data when the component mounts
  useEffect(() => {
    loadStoredData();
  }, []);

  // Refresh data
  const refreshStoreData= () => {
    loadStoredData();
  };

  // ******************** CALORIES MANAGEMENT *************************
  //--------------------------------------------------------

  // On press Calorie day
  const handleDayPress = (index: number) => {
    setSelectedDay(index);
    setInputCalories(calories[index] || '');
    setModalVisible(true);
  };

  // Save calories for the selected day and persist data
  const handleSave = async () => {
    if (selectedDay !== null) { // Check for valid index
      const newCalories = [...calories];
      newCalories[selectedDay] = inputCalories;
      setCalories(newCalories);
      await saveData('caloriesData', newCalories); // Persist data
    }
    setModalVisible(false);
  };

  // Function to Calculate Total Calories. 
  const getTotalCalories = () => {
    return calories
      .filter((cal) => cal !== null && cal !== '') // Remove empty values
      .reduce((sum, cal) => sum + Number(cal), 0); // Convert to number and sum
  };

  // Function to handle Goal of Calories -  
  const handleGoalPress = () => {
    setInputCaloriesGoal(caloriesGoal || '');
    setModalGoalVisible(true);
  };
  // Save calorie goal and persist data
  const handleGoalSave = async () => {
    setCaloriesGoal(inputCaloriesGoal);
    await saveData('caloriesGoal', inputCaloriesGoal);
    setModalGoalVisible(false);
  };


  // ******************** ROUTINE TIME MANAGEMENT *************************
  //--------------------------------------------------------
  
  // On press Calorie day
  const handleRoutineTimeDayPress = (index: number) => {
    setSelectedRoutineDay(index);
    setInputRoutineTime(routineTime[index] || '');
    setModalVisibleTime(true);
  };

  // Save calories for the selected day and persist data
  const handleRoutineTimeSave = async () => {
    if (selectedRoutineDay !== null) { // Check for valid index
      const newRoutineTime = [...routineTime];
      newRoutineTime[selectedRoutineDay] = inputRoutineTime;
      setRoutineTime(newRoutineTime);
      await saveData('routineTimeData', newRoutineTime); // Persist data
    }
    setModalVisibleTime(false);
  };
  // Function to Calculate Total Time spent. 
  const getTotalRoutineTime = () => {
    const totalMinutes = routineTime
    .filter((timeSpent) => timeSpent !== null && timeSpent !== '') // Remove empty values
    .reduce((sum, timeSpent) => sum + Number(timeSpent), 0); // Convert to number and sum

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  }
  return `${totalMinutes}m`;
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
        <ThemedText type="title">Step 2 - Diet & Time Tracking</ThemedText>
      </ThemedView>



      {/* ----------------RENDERING CALORIES MANAGEMENT---------------------- */}
      {/* ---------------------------------------------- */}
      
      <Collapsible title='Track your calories intake'>
        {/* Calorie Goal Management */}
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

        <View style={styles.hr} /> 

        <Text style={styles.textParagraph}>Insert the calories you eat each day.</Text>
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
                  width: 60, // Adjust width for better spacing
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
        
        <View style={styles.hr} />

      </Collapsible>

      <View style={styles.goalCard}>
          <Text style={styles.title}>
            Total Calories: {getTotalCalories()} kcal   
          </Text>
      </View>



      {/* ----------------RENDERING TIME MANAGEMENT---------------------- */}
      {/* ---------------------------------------------- */}

      <Collapsible title='Track your routine time.'>
      
        {/* Creating a List with all the components of the Array */}
        <FlatList
              data={Array.from({ length: 14 }, (_, i) => i + 1)}
              numColumns={4} // Display as a grid (7 days per row)
              keyExtractor={(item) => item.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: routineTime[index] ? '#198754' : '#ddd',
                    padding: 20,
                    margin: 5,
                    borderRadius: 10,
                    alignItems: 'center',
                    width: 60, // Adjust width for better spacing
                  }}
                  onPress={() => handleRoutineTimeDayPress(index)}
                >
                  <Text style={{ fontWeight: 'bold', color: routineTime[index] ? 'white' : 'black' }}>
                    Day  {' '+ item} {routineTime[index] && <Text>{routineTime[index]}</Text>}
                  </Text>
                  
                </TouchableOpacity>
              )}
            />
            {/* This Modal is used to insert the numbers of minutes by the user */}
            <Modal visible={modalVisibleTime} animationType="slide" transparent={true}>
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
                  <Text>Enter Minutes for Day {(selectedRoutineDay ?? 0) + 1}</Text>
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Minutes"
                    value={inputRoutineTime}
                    onChangeText={setInputRoutineTime}
                    style={{
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  />
                  <TouchableOpacity style={styles.button} onPress={handleRoutineTimeSave}>
                      <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.buttonCancel}  onPress={() => setModalVisibleTime(false)}>
                      <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
      </Collapsible>

      <View style= {styles.goalCard}>
        <Text style={styles.title}>
            Total Routine Time: {getTotalRoutineTime()}  
        </Text>     
      </View>

      <View style= {styles.goalCard}>
        <Text style={styles.title}>
          Your routine is : {routineName}
        </Text>
        <Text style={styles.textParagraph}>
          Amount of Calories per 30 minutes: {routineCalories} Calories.
        </Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={refreshStoreData}>
            <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>

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
  chartTitle: {  // <-- Renamed from "title"
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  goalCard: {
    backgroundColor:'#ddd',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', // Adjust width for better spacing
  },
});
