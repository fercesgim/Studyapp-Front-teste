import React, { useEffect } from 'react';
import { useApp, ACTIONS } from '../context/AppContext';
import { getMyStudyPlans } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Efeito para buscar os dados quando o componente é montado
  useEffect(() => {
    const fetchStudyPlans = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      try {
        const data = await getMyStudyPlans();
        dispatch({ type: ACTIONS.SET_ALL_STUDY_PLANS, payload: data.study_plans || [] });
      } catch (error) {
        console.error("Erro ao buscar planos de estudo:", error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Não foi possível carregar os planos de estudo." });
      } finally {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      }
    };

    if (state.studyPlans.length === 0) {
      fetchStudyPlans();
    }
  }, [dispatch, state.studyPlans.length]);


  // --- LÓGICA DE CÁLCULO CORRIGIDA ---
  const totalStudyPlans = state.studyPlans.length;
  const totalQuizzes = state.quizResults.length;

  const allEvaluations = state.quizResults.flatMap(result => result.feedback?.quiz_evaluations || []);
  
  const averageScore = allEvaluations.length > 0
    ? allEvaluations.reduce((acc, evalItem) => acc + (evalItem.percentage || 0), 0) / allEvaluations.length
    : 0;

  const chartData = state.quizResults.slice(-5).map((result, index) => ({
    name: `Teste ${index + 1}`,
    pontuacao: result.feedback?.quiz_evaluations?.[0]?.percentage || 0,
  }));

  // Se estiver a carregar, mostra um indicador
  if (state.loading && state.studyPlans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar os seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seu progresso e desempenho nos estudos</p>
        </div>

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
                  <YAxis unit="%" domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Bar dataKey="pontuacao" fill="#8b5cf6" name="Pontuação" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Lista de Planos de Estudo (código anterior mantido) */}
        <Card>
          <CardHeader>
            <CardTitle>Planos de Estudo Recentes</CardTitle>
            <CardDescription>Seus últimos planos criados</CardDescription>
          </CardHeader>
          <CardContent>
            {state.studyPlans.length > 0 ? (
              <div className="space-y-4">
                {state.studyPlans.map((plan, index) => (
                  <div 
                    key={plan.id || index} 
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      dispatch({ type: ACTIONS.SET_STUDY_PLAN, payload: plan });
                      dispatch({ type: ACTIONS.SET_QUIZZES, payload: plan.quizzes || [] });
                      navigate(`/study-plan`);
                    }}
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
      </div>
    </div>
  );
};

export default Dashboard;