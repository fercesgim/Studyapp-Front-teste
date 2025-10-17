import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { state } = useApp();
  const navigate = useNavigate();

  // Calcular estatísticas
  const totalStudyPlans = state.studyPlans.length;
  const totalQuizzes = state.quizResults.length;
  
  // Calcular média de desempenho
  const averageScore = state.quizResults.length > 0
    ? state.quizResults.reduce((acc, result) => {
        const score = result.feedback?.quiz_evaluations?.reduce((sum, quiz) => {
          return sum + (quiz.score || 0);
        }, 0) || 0;
        return acc + score;
      }, 0) / state.quizResults.length
    : 0;

  // Dados para o gráfico
  const chartData = state.quizResults.slice(-5).map((result, index) => ({
    name: `Teste ${index + 1}`,
    pontuacao: result.feedback?.quiz_evaluations?.[0]?.score || 0,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seu progresso e desempenho nos estudos</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planos de Estudo</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudyPlans}</div>
              <p className="text-xs text-muted-foreground">Total criados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questionários</CardTitle>
              <Brain className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">Testes realizados</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desempenho Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Pontuação média</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/upload')} 
                className="w-full"
                size="sm"
              >
                Novo Plano
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Desempenho */}
        {chartData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Histórico de Desempenho</CardTitle>
              <CardDescription>Seus últimos 5 testes realizados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pontuacao" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Lista de Planos de Estudo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Planos de Estudo Recentes</CardTitle>
              <CardDescription>Seus últimos planos criados</CardDescription>
            </CardHeader>
            <CardContent>
              {state.studyPlans.length > 0 ? (
                <div className="space-y-4">
                  {state.studyPlans.slice(-5).reverse().map((plan, index) => (
                    <div 
                      key={index} 
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/study-plan/${index}`)}
                    >
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{plan.summary}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>⏱️ {plan.estimated_time}</span>
                        <span>•</span>
                        <span>📚 {plan.topics?.length || 0} tópicos</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum plano de estudo criado ainda</p>
                  <Button 
                    onClick={() => navigate('/upload')} 
                    className="mt-4"
                    variant="outline"
                  >
                    Criar Primeiro Plano
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Resultados de Questionários */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados Recentes</CardTitle>
              <CardDescription>Seus últimos testes realizados</CardDescription>
            </CardHeader>
            <CardContent>
              {state.quizResults.length > 0 ? (
                <div className="space-y-4">
                  {state.quizResults.slice(-5).reverse().map((result, index) => {
                    const score = result.feedback?.quiz_evaluations?.[0]?.score || 0;
                    return (
                      <div 
                        key={index} 
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Teste #{state.quizResults.length - index}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {result.feedback?.overall_performance?.substring(0, 100)}...
                            </p>
                          </div>
                          <div className={`text-lg font-bold ${
                            score >= 70 ? 'text-green-600' : 
                            score >= 50 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {score}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum teste realizado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

