import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Target, Calendar, Brain } from 'lucide-react';

const StudyPlan = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const plan = state.currentStudyPlan;

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Nenhum plano de estudo encontrado</h2>
            <p className="text-gray-600 mb-4">
              Faça upload de materiais para gerar um plano de estudo personalizado.
            </p>
            <Button onClick={() => navigate('/upload')}>
              Fazer Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{plan.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{plan.estimated_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{plan.topics?.length || 0} tópicos</span>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Resumo do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{plan.summary}</p>
          </CardContent>
        </Card>

        {/* Tópicos Principais */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tópicos Principais
            </CardTitle>
            <CardDescription>Principais assuntos abordados neste material</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.topics?.map((topic, index) => (
                <div 
                  key={index} 
                  className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-900">{topic}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conceitos-Chave */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Conceitos-Chave
            </CardTitle>
            <CardDescription>Conceitos fundamentais para dominar este conteúdo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plan.key_concepts?.map((concept, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cronograma de Estudos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma de Estudos
            </CardTitle>
            <CardDescription>Planejamento sugerido para seus estudos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plan.study_schedule && Object.entries(plan.study_schedule).map(([period, activities], index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{period}</h3>
                  <p className="text-gray-700">{activities}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Questionários Disponíveis */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questionários Disponíveis</CardTitle>
            <CardDescription>
              Teste seus conhecimentos com questionários personalizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.quizzes?.map((quiz, index) => (
                <div 
                  key={quiz.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-all hover:border-blue-500 cursor-pointer"
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {quiz.questions?.length || 0} questões
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {quiz.description || 'Teste seus conhecimentos sobre o conteúdo estudado'}
                  </p>
                  <Button size="sm" className="w-full">
                    Iniciar Quiz
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
            Voltar ao Dashboard
          </Button>
          <Button onClick={() => navigate('/upload')} className="flex-1">
            Criar Novo Plano
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;

