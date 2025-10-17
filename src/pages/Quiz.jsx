import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, ACTIONS } from '../context/AppContext';
import { submitAnswers } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const quiz = state.quizzes?.find(q => q.id === parseInt(id));

  useEffect(() => {
    if (quiz) {
      // Inicializar respostas vazias
      const initialAnswers = {};
      quiz.questions?.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Quiz não encontrado</h2>
            <p className="text-gray-600 mb-4">
              O questionário que você está procurando não existe.
            </p>
            <Button onClick={() => navigate('/study-plan')}>
              Voltar ao Plano de Estudo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Preparar respostas no formato esperado pela API
      const quizResponses = Object.entries(answers).map(([questionId, answer]) => ({
        quiz_id: quiz.id,
        question_id: parseInt(questionId),
        user_answer: answer
      }));

      const result = await submitAnswers(state.sessionId, quizResponses);
      
      setFeedback(result.feedback);
      setShowResults(true);
      
      // Salvar resultado no contexto
      dispatch({ 
        type: ACTIONS.ADD_QUIZ_RESULT, 
        payload: { 
          quizId: quiz.id, 
          feedback: result.feedback,
          timestamp: new Date().toISOString()
        } 
      });
    } catch (err) {
      console.error('Erro ao submeter respostas:', err);
      alert('Erro ao enviar respostas. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const questionType = currentQuestion.type || 'multiple_choice';

    switch (questionType) {
      case 'multiple_choice':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id]} 
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'true_false':
        return (
          <RadioGroup 
            value={answers[currentQuestion.id]} 
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Verdadeiro" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">Verdadeiro</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value="Falso" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">Falso</Label>
            </div>
          </RadioGroup>
        );
      
      case 'open':
        return (
          <Textarea
            value={answers[currentQuestion.id]}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="min-h-[150px]"
          />
        );
      
      default:
        return (
          <Input
            value={answers[currentQuestion.id]}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="Digite sua resposta..."
          />
        );
    }
  };

  if (showResults && feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resultados do Quiz</h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>

          {/* Desempenho Geral */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Desempenho Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                {feedback.overall_performance}
              </p>
              {feedback.quiz_evaluations?.map((evaluation, index) => (
                <div key={index} className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Pontuação:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {evaluation.score}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Análise de Desempenho */}
          {feedback.performance_analysis && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Análise de Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pontos Fortes */}
                {feedback.performance_analysis.strong_areas?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Pontos Fortes
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {feedback.performance_analysis.strong_areas.map((area, index) => (
                        <li key={index} className="text-gray-700">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Áreas de Melhoria */}
                {feedback.performance_analysis.weak_areas?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Áreas de Melhoria
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {feedback.performance_analysis.weak_areas.map((area, index) => (
                        <li key={index} className="text-gray-700">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sugestões de Melhoria */}
                {feedback.performance_analysis.improvement_suggestions?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-blue-700 mb-2">
                      Sugestões de Melhoria
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {feedback.performance_analysis.improvement_suggestions.map((suggestion, index) => (
                        <li key={index} className="text-gray-700">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Avaliações Detalhadas */}
          {feedback.quiz_evaluations?.map((evaluation, evalIndex) => (
            <Card key={evalIndex} className="mb-6">
              <CardHeader>
                <CardTitle>Respostas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {evaluation.question_evaluations?.map((qEval, qIndex) => (
                  <div key={qIndex} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        Questão {qEval.question_id}
                      </h4>
                      {qEval.is_correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Sua resposta:</strong> {qEval.user_answer}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Feedback:</strong> {qEval.feedback}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Botões de Ação */}
          <div className="flex gap-4">
            <Button onClick={() => navigate('/study-plan')} variant="outline" className="flex-1">
              Voltar ao Plano
            </Button>
            <Button onClick={() => navigate('/dashboard')} className="flex-1">
              Ir para Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>Questão {currentQuestionIndex + 1} de {totalQuestions}</span>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Questão Atual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questão {currentQuestionIndex + 1}</CardTitle>
            <CardDescription>{currentQuestion?.question}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuestionInput()}
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {!isLastQuestion ? (
            <Button
              onClick={handleNext}
              className="flex-1"
            >
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || Object.values(answers).some(a => !a)}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Enviando...
                </>
              ) : (
                'Finalizar Quiz'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

