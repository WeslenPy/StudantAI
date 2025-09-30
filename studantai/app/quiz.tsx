import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StatusMarging from '../components/statusBar';
import { router, useGlobalSearchParams } from 'expo-router';


export default function ModernQuizScreen() {

  const [userAnswers, setUserAnswers] = useState({});

  const { data } = useGlobalSearchParams();

  const questions = data ? JSON.parse(data as string) : {};
  const totalQuestions = questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleFinish = () => {
    const correctAnswers = calculateCorrectAnswers();
    
    router.push({
      pathname:'finish', 
      params:{
        data:JSON.stringify({
          correctAnswers: correctAnswers,
          totalQuestions: totalQuestions,
        })
      }
    });
  };



  const handleNext = () => {

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }else{
      handleFinish()
    }


  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSelectAnswer = (option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]:option
    }));
  };


  const calculateCorrectAnswers = () => {
    let correct = 0;
    
    questions.forEach((question,index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer == question.resposta_correta) {
        correct++;
      }
    });

    return correct;
  };


  const question = questions[currentQuestion];

  const answeredQuestions = Object.keys(userAnswers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <StatusMarging >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=>router.navigate("/home")}>
          <Ionicons name="chevron-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>TEMA</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width:  `${progressPercentage}%`}]} />
          </View>
        </View>
      </View>

      <ScrollView  
          contentContainerStyle={{
            paddingBottom: 20, 
            paddingTop:5,   
            paddingHorizontal: 2, 
          }}>
        <View style={styles.questionCard}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionNumber}>{(currentQuestion+1).toString().padStart(2,"0")}</Text>
          </View>
          <Text style={styles.questionText}>
            {question?.pergunta}
          </Text>
        </View>

        <View style={styles.answersContainer}>
          {question?.alternativas.map((answer, index) => {
             const isSelected = userAnswers[currentQuestion] === index;

              return (
                <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handleSelectAnswer(index)}
                style={styles.answerWrapper}
              >
                <LinearGradient
                  colors={isSelected ? ['#10B981', '#059669']: ['#F9FAFB', '#F3F4F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.answerButton,
                    isSelected && styles.answerSelected,
                  ]}
                >
                  <View style={styles.answerContent}>
                    <View style={[
                      styles.answerBadge,
                      isSelected && styles.answerBadgeSelected
                    ]}>
                      <Text style={[
                        styles.answerBadgeText,
                        isSelected && styles.answerBadgeTextSelected
                      ]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.answerText,
                      isSelected && styles.answerTextSelected
                    ]}>
                      {answer}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            
              )

          })}

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.navButton,currentQuestion<=0 && styles.navButtonDisabled]} onPress={handlePrev}
        disabled={currentQuestion<=0}
        
        >
          <Ionicons name="chevron-back-circle" size={40} color="#6366F1" />
        </TouchableOpacity>

        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>Respondendo</Text>
          <Text style={styles.progressNumber}>Respondendo {currentQuestion + 1} de {questions.length}</Text>
        </View>

        <TouchableOpacity 
          onPress={handleNext}
          style={[styles.navButton, userAnswers[currentQuestion]===undefined && styles.navButtonDisabled]}
          disabled={userAnswers[currentQuestion]===undefined}
        >
          <Ionicons 
            name="chevron-forward-circle" 
            size={40} 
            color={userAnswers[currentQuestion]!==undefined ? "#6366F1" : "#D1D5DB"} 
          />
        </TouchableOpacity>
      </View>
    </StatusMarging>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
  questionCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  questionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 30,
  },
  answersContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  answerWrapper: {
    borderRadius: 20,
  },
  answerButton: {
    borderRadius: 20,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  answerSelected: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
    backgroundColor: 'transparent',
    borderRadius: 18,
  },
  answerBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  answerBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  answerBadgeTextSelected: {
    color: '#FFFFFF',
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  answerTextSelected: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  progressNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
});