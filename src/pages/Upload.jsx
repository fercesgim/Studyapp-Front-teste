import React, { useState } from 'react';
import { useApp, ACTIONS } from '../context/AppContext';
import { uploadMaterials } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Upload = () => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'pptx'].includes(extension) && file.size <= 10485760; // 10MB
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Alguns arquivos foram ignorados. Apenas PDF e PPTX com até 10MB são aceitos.');
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await uploadMaterials(files);
      
      dispatch({ type: ACTIONS.ADD_STUDY_PLAN, payload: { ...result.study_plan, sessionId: result.session_id, quizzes: result.quizzes } });
      dispatch({ type: ACTIONS.SET_QUIZZES, payload: result.quizzes });
      dispatch({ type: ACTIONS.SET_SESSION_ID, payload: result.session_id });
      
      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/study-plan');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao fazer upload dos arquivos. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload de Materiais</h1>
          <p className="text-gray-600">Faça upload de seus materiais de estudo para gerar um plano personalizado</p>
        </div>

        {/* Card Principal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Selecione seus arquivos</CardTitle>
            <CardDescription>
              Aceitos: PDF e PowerPoint (PPTX) • Tamanho máximo: 10MB por arquivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Área de Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.pptx"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Clique para selecionar arquivos
                </p>
                <p className="text-sm text-gray-500">
                  ou arraste e solte aqui
                </p>
              </label>
            </div>

            {/* Lista de Arquivos Selecionados */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Arquivos selecionados ({files.length})
                </h3>
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Mensagens de Erro e Sucesso */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Plano de estudo gerado com sucesso! Redirecionando...
                </p>
              </div>
            )}

            {/* Botão de Upload */}
            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
                className="flex-1"
                size="lg"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Gerar Plano de Estudo
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                disabled={uploading}
                size="lg"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Como funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Upload dos Materiais</h4>
                  <p className="text-sm text-gray-600">
                    Selecione seus arquivos PDF ou PowerPoint com o conteúdo das aulas
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Processamento Inteligente</h4>
                  <p className="text-sm text-gray-600">
                    Nossa IA analisa o conteúdo e gera um plano de estudo personalizado
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Questionários Adaptativos</h4>
                  <p className="text-sm text-gray-600">
                    Receba questionários personalizados para testar seu conhecimento
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;

