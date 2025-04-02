
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
// Importing chart libraries
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';

import { getData } from '../storage/storageService';

export default function Stadistics() {
  const [chartData, setChartData] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [caloriesGoal, setCaloriesGoal] = useState(0);
  // Minutes data
  const [chartRoutineData, setChartRoutineTimeData] = useState([]);
  const [totalRoutineTime, setTotalRoutineTime] = useState<string>('');
  // Routine info
  const [routineName, setRoutineName] = useState(null);
  const [routineCalories, setRoutineCalories] = useState(null);
  
  const fetchData = async () => {
    try {
      const storedCalories = await getData('caloriesData');
      const storedGoal = await getData('caloriesGoal');
      const storedRoutine = await getData('routineData');
      const storedRoutineTime = await getData('routineTimeData');

      // CALORIES VARIABLES

      if (storedGoal) setCaloriesGoal(storedGoal);

      if (storedCalories) {
        const formattedData = storedCalories.map((cal:number, index:number) => ({
          day: `Day ${index + 1}`,
          calories: cal ? Number(cal) : 0,
        }));
        setTotalCalories(
          formattedData.reduce((sum:number, item:any) => sum + (item.calories || 0), 0)
        );
        setChartData(formattedData);
      }

      // ROUTINE TIME VARIABLES 

      if (storedRoutine) {
        setRoutineName(storedRoutine.title);
        setRoutineCalories(storedRoutine.calories);
      };
      if (storedRoutineTime) {
        const formattedData = storedRoutineTime.map((cal:number, index:number) => ({
          day: `Day ${index + 1}`,
          calories: cal ? Number(cal) : 0,
        }));
        const totalMinutes = formattedData.reduce((sum:number, item:any) => sum + (item.calories || 0), 0)
        if (totalMinutes >= 60) {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          if (minutes === 0 ){
            setTotalRoutineTime(`${hours}h`); 
          }else {
            setTotalRoutineTime(`${hours}h ${minutes}m`);
          }
        } else {
          setTotalRoutineTime(`${totalMinutes}m`);
        }
        
        setChartRoutineTimeData(formattedData);
      }


    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };
  // Call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

   // Format data for BarChart
  const chartDataFormatted = chartData.map((item: { day: string; calories: number }) => ({
    value: item.calories,
    label: item.day, // X-axis label
    frontColor: item.calories > 2000 ? 'red' : '#0d6efd', // Example: highlight high values
  })); 

  //Line Chart Data
  const lineChartData = chartData.map((item: { day: string; calories: number }) => ({
    value: item.calories,
    label: item.day,
  }));

  // BarChart for Minutes per Day
  const chartDataRoutineFormatted = chartRoutineData.map((item: { day: string; calories: number }) => ({
    value: item.calories,
    label: item.day, // X-axis label
    frontColor: item.calories > 2000 ? 'red' : '#B96AC9', // Example: highlight high values
  })); 

  // Refresh data
  const refreshTotalCalories = () => {
    fetchData();
  };
 
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="star.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Step 3 - Status</ThemedText>
      </ThemedView>
      
      <View style={styles.container}>
        <Text style={styles.title}>Your Statistics</Text>
        <Text>Total Calories Intake: {totalCalories} kcal</Text>
        <Text>Calories Goal Intake: {caloriesGoal} kcal</Text>
        <View style={styles.hr} />
        <Text>Your exercise Routine is: {routineName} with {routineCalories} calories every 30 minutes</Text>
        <Text>Total Workout Time: {totalRoutineTime}</Text>

      </View>
      <TouchableOpacity style={styles.refreshButton} onPress={refreshTotalCalories}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
        {/* BarChart */}
        <View>
        <Text style={styles.chartTitle}>Calorie Intake</Text>
          <BarChart 
            data={chartDataFormatted}
            height={200}
            width={290}
            barWidth={18}
            minHeight={3}
            barBorderRadius={3}
            noOfSections={4}
            xAxisLabelTextStyle={{color:'gray'}}
            yAxisTextStyle={{color:'gray'}}
            isAnimated
          />
        </View>
        {/* Line Chart */}
        <View>
            <Text style={styles.chartTitle}>Calorie Trend Over Time</Text>
            <LineChart 
              areaChart
              hideDataPoints
              startFillColor="#0BA5A4"
              startOpacity={1}
              endOpacity={0.3}
              initialSpacing={0}
              data={lineChartData}
              spacing={30}
              thickness={5}
              hideRules
              noOfSections={5}
              yAxisColor="#0BA5A4"
              showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              xAxisColor="#0BA5A4"
              color="#0BA5A4" />
        </View>
        {/* BarChart for Workout */}
        <View>
        <Text style={styles.chartTitle}>Workout Status</Text>
          <BarChart 
            data={chartDataRoutineFormatted}
            height={200}
            width={290}
            barWidth={18}
            minHeight={3}
            barBorderRadius={3}
            noOfSections={4}
            xAxisLabelTextStyle={{color:'gray'}}
            yAxisTextStyle={{color:'gray'}}
            isAnimated
          />
        </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     padding: 20,
     borderRadius: 5,
     backgroundColor: '#FFD2FC' 
  },
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom:20, textAlign: 'center' },
  pieChart: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  refreshButton: {
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
