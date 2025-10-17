import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Clock, Target, Calendar, Brain, CheckCircle, RefreshCw, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            <h2 className="text-xl font-semibold mb-2">Nenhum plano de estudo selecionado</h2>
            <p className="text-gray-600 mb-4">Vá ao Dashboard para ver seus planos ou faça upload de um novo material.</p>
            <Button onClick={() => navigate('/dashboard')}>Ir para o Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const studyPlanData = plan;
  const quizzesData = plan.quizzes || [];
  const originalContent = plan.original_content || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{studyPlanData.title}</h1>
          {/* ... Header ... */}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Resumo do Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{studyPlanData.summary}</p>
          </CardContent>
        </Card>
        
        {/* --- CONTEÚDO ORIGINAL ADICIONADO --- */}
        {originalContent && (
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Material de Estudo
                    </CardTitle>
                    <CardDescription>Consulte o conteúdo completo que você enviou.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Ver material de estudo completo</AccordionTrigger>
                            <AccordionContent>
                                <div className="prose max-w-none whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-md">
                                    {originalContent}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        )}

        {/* ... Tópicos e outros cards ... */}

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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Questionários Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzesData.map((quiz) => {
                const isAnswered = state.quizResults.some(result => result.quizId === quiz.id);
                return (
                  <div key={quiz.id} className={cn("p-4 border rounded-lg transition-all flex flex-col justify-between", isAnswered ? "bg-green-50 border-green-200" : "hover:shadow-md hover:border-blue-500")}>
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        {isAnswered && (<div className="flex items-center gap-1 text-xs text-green-700 font-medium"><CheckCircle className="h-4 w-4" /><span>Respondido</span></div>)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{quiz.description || 'Teste seus conhecimentos.'}</p>
                    </div>
                    <Button size="sm" className="w-full mt-auto" variant={isAnswered ? "outline" : "default"} onClick={() => navigate(`/quiz/${quiz.id}`)}>
                      {isAnswered ? (<><RefreshCw className="h-4 w-4 mr-2" />Tentar Novamente</>) : ("Iniciar Quiz")}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">Voltar ao Dashboard</Button>
          <Button onClick={() => navigate('/upload')} className="flex-1">Criar Novo Plano</Button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;