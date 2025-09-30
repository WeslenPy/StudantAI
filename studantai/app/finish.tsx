import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useGlobalSearchParams } from 'expo-router';
import StatusMarging from '../components/statusBar';

export default function QuizResultScreen() {

    const { data } = useGlobalSearchParams();

    const result = data ? JSON.parse(data as string) : {};

    const correctAnswers = result.correctAnswers;
    const totalQuestions = result.totalQuestions;

    
    const percentage = (correctAnswers / totalQuestions) * 100;
    
    const getStars = () => {
        if (percentage >= 90) return 3;
        if (percentage >= 70) return 2;
        if (percentage >= 50) return 1;
        return 0;
    };
    
    const stars = getStars();
    
    const getMessage = () => {
        if (percentage >= 90) return 'Excelente!';
        if (percentage >= 70) return 'Muito Bom!';
        if (percentage >= 50) return 'Bom trabalho!';
        return 'Continue praticando!';
    };
    
    const getSubMessage = () => {
        if (percentage >= 90) return 'Você domina o assunto!';
        if (percentage >= 70) return 'Está no caminho certo!';
        if (percentage >= 50) return 'Pode melhorar ainda mais!';
        return 'Não desista, tente novamente!';
    };
    
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const starAnimations = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;
    
    useEffect(() => {
        Animated.sequence([
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
            toValue: percentage,
            duration: 1500,
            useNativeDriver: false,
        }),
        ]).start();
        
        starAnimations.forEach((anim, index) => {
        if (index < stars) {
            Animated.sequence([
            Animated.delay(1000 + index * 200),
            Animated.spring(anim, {
                toValue: 1,
                tension: 100,
                friction: 5,
                useNativeDriver: true,
            }),
            ]).start();
        }
        });
    }, []);
    
    const handleGoHome = () => {
       router.navigate("/home")
    };
    
    const handleTryAgain = () => {
       router.back()

    };
    
    const animatedPercentage = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

  return (
    <StatusMarging >
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        {/* Confete decorativo */}
        {percentage >= 70 && (
          <View style={styles.confettiContainer}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.confetti,
                  {
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][i % 4],
                    transform: [{ rotate: `${Math.random() * 360}deg` }],
                  },
                ]}
              />
            ))}
          </View>
        )}
        
        {/* Card principal */}
        <Animated.View
          style={[
            styles.resultCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Ícone de troféu */}
          <View style={styles.trophyContainer}>
            <LinearGradient
              colors={percentage >= 70 ? ['#F59E0B', '#D97706'] : ['#6B7280', '#4B5563']}
              style={styles.trophyCircle}
            >
              <Ionicons 
                name={percentage >= 70 ? "trophy" : "ribbon"} 
                size={60} 
                color="#FFFFFF" 
              />
            </LinearGradient>
          </View>
          
          {/* Mensagem */}
          <Text style={styles.mainMessage}>{getMessage()}</Text>
          <Text style={styles.subMessage}>{getSubMessage()}</Text>
          
          {/* Estrelas */}
          <View style={styles.starsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={{
                  transform: [
                    {
                      scale: starAnimations[index],
                    },
                  ],
                }}
              >
                <Ionicons
                  name={index < stars ? "star" : "star-outline"}
                  size={50}
                  color={index < stars ? "#F59E0B" : "#D1D5DB"}
                />
              </Animated.View>
            ))}
          </View>
          
          {/* Pontuação */}
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreNumber}>{correctAnswers}</Text>
            <Text style={styles.scoreTotal}>/ {totalQuestions}</Text>
          </View>
          <Text style={styles.scoreLabel}>Questões corretas</Text>
          
          {/* Barra de progresso circular */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarWrapper}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: animatedPercentage,
                      backgroundColor: percentage >= 70 ? '#10B981' : percentage >= 50 ? '#F59E0B' : '#EF4444',
                    },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
          </View>
          
          {/* Estatísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="checkmark" size={24} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Corretas</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close" size={24} color="#EF4444" />
              </View>
              <Text style={styles.statNumber}>{totalQuestions - correctAnswers}</Text>
              <Text style={styles.statLabel}>Erradas</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statCircle, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="document-text" size={24} color="#6366F1" />
              </View>
              <Text style={styles.statNumber}>{totalQuestions}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Botões de ação */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleTryAgain}
            style={styles.secondaryButton}
          >
            <Ionicons name="refresh" size={20} color="#6366F1" />
            <Text style={styles.secondaryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleGoHome}
            style={styles.primaryButton}
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <Ionicons name="home" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Voltar ao Início</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </StatusMarging>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  trophyContainer: {
    marginBottom: 24,
    marginTop: -80,
  },
  trophyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  mainMessage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#6366F1',
  },
  scoreTotal: {
    fontSize: 32,
    fontWeight: '600',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBarWrapper: {
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366F1',
  },
});