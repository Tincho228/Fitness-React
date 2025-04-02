import { View, Image, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { saveData, getData, removeData } from '../storage/storageService';  // Import storage functions

export default function HomeScreen() {
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchData = async () => {
    try {
      const storedRoutine = await getData('routineData');
      // Check if the value is null
      if (storedRoutine) setSelectedCard(storedRoutine.title);

    } catch (error) {
      console.error('Error loading routines:', error);
    }
  }

 // Call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handlePress = async (card:any, calories:string) => {
    if (selectedCard === card) {
      setSelectedCard(null); // Reset selection and remove item
      await removeData('routineData')
    } else {
      setSelectedCard(card);
      const routineObject = {
        title: card,
        calories: calories
      }
      await saveData ('routineData', routineObject )
    }
  };

  const getButtonText = (card:any) => {
    if (selectedCard === card) return 'Quit Routine';
    return 'Start';
  };

  const getButtonStyle = (card:any) => {
    return {
      backgroundColor: selectedCard === card ? 'red' : '#0d6efd',
    };
  };
  return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image
            source={require('@/assets/images/bg-home-index.jpg')}
            style={styles.reactLogo}
          />
        }>
      
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to Step 1!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <Text style={styles.textParagraph}>
          Your journey to a healthier, stronger you starts now! Whether you want to build strength, 
          boost endurance, or improve flexibility, we’ve got the perfect workouts for you. Stay motivated,
          track your progress, and make every workout count.
          </Text>
        </ThemedView>
        <View style={styles.hr} />
        <ThemedView style={styles.stepContainer}>
          <Text style={styles.textTitle}>Let’s crush those fitness goals together!"</Text>
          <Text style={styles.textSubTitle}>Choose Your Routine Of 14 Days</Text>
        </ThemedView>
        <View style={styles.hr} />

                    {/* FIRST CARD */}

        <View style={styles.card}>
        {/* Header Image */}
        <Image 
          source={require('@/assets/images/workout.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />

        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title}>Full-Body Strength Routine</Text>
          <Text style={styles.description}>
                A balanced workout targeting all major muscle groups. Includes squats, push-ups, deadlifts, 
                and planks to build strength and endurance. Ideal for users who want overall fitness in minimal
                time.
          </Text>
          <Text style={styles.calTitle}>🔥180–300 calories</Text>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, getButtonStyle('Full-Body Strength Routine')]}
            onPress={() => handlePress('Full-Body Strength Routine', '180-300')}
            disabled={!!selectedCard && selectedCard !== 'Full-Body Strength Routine'}
          >
            <Text style={styles.buttonText}>{getButtonText('Full-Body Strength Routine')}</Text>
          </TouchableOpacity>
        </View>
      </View>

                  {/* SECOND CARD */}

                  <View style={styles.card}>
        {/* Header Image */}
        <Image 
          source={require('@/assets/images/hitt.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />

        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title}>HIIT (High-Intensity Interval Training)</Text>
          <Text style={styles.description}>
          A fast-paced routine combining short bursts of intense exercise with rest periods. 
          Exercises like burpees, jumping lunges, and mountain climbers help burn calories and improve cardiovascular health efficiently.
          </Text>
          <Text style={styles.calTitle}>🔥 250–450 calories</Text>
          {/* Button */}
          <TouchableOpacity
            style={[styles.button, getButtonStyle('HIIT')]}
            onPress={() => handlePress('HIIT', '250-450')}
            disabled={!!selectedCard && selectedCard !== 'HIIT'}
          >
            <Text style={styles.buttonText}>{getButtonText('HIIT')}</Text>
          </TouchableOpacity>
        </View>
      </View>

                  {/* THIRD CARD */}

                  <View style={styles.card}>
        {/* Header Image */}
        <Image 
          source={require('@/assets/images/core.jpg')} 
          style={styles.image} 
          resizeMode="cover" 
        />

        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.title}>Core & Flexibility Routine</Text>
          <Text style={styles.description}>
            Focuses on strengthening the core muscles and improving flexibility with exercises like planks, Russian twists, and yoga poses. 
            Great for users looking to improve posture, balance, and injury prevention.
          </Text>
          <Text style={styles.calTitle}>🔥 100–180 calories</Text>
          {/* Button */}
          <TouchableOpacity
            style={[styles.button, getButtonStyle('Core & Flexibility Routine')]}
            onPress={() => handlePress('Core & Flexibility Routine','100-180')}
            disabled={!!selectedCard && selectedCard !== 'Core & Flexibility Routine'}
          >
            <Text style={styles.buttonText}>{getButtonText('Core & Flexibility Routine')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    
      </ParallaxScrollView>
);
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200
  },
  
  textTitle: {
    color: "#007BFF",
    fontWeight:500,
    fontSize: 24,
    textAlign:"center",
    marginTop:20,
  },
  textSubTitle: {
    color: "gray",
    fontWeight:500,
    fontSize: 18,
    textAlign:"center",
    marginBottom:20
  },
  textParagraph: {
    color: "gray",
    fontWeight:500,
    fontSize: 20,
    textAlign:"center"
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 500,
    width: 450,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    margin: 16,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  calTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10, // Espaciado arriba y abajo
  },
  
});
