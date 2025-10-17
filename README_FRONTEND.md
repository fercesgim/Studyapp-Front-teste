# StudyPlatform Frontend

Este é o frontend da Plataforma de Estudos, construído com React e Tailwind CSS. Ele permite aos usuários:

- **Registrar e fazer login:** Gerenciamento de contas de usuário com autenticação JWT.
- **Fazer upload de materiais:** Enviar arquivos PDF e PowerPoint para gerar planos de estudo e questionários.
- **Visualizar planos de estudo:** Acessar resumos, tópicos e conceitos-chave gerados a partir dos materiais.
- **Realizar questionários:** Testar conhecimentos com questões interativas.
- **Acompanhar o progresso:** Um dashboard para visualizar planos de estudo criados e resultados de testes.

## Novidades (Autenticação e MongoDB)

Esta versão inclui um sistema completo de autenticação de usuários com registro, login e proteção de rotas, utilizando JWT (JSON Web Tokens). O backend foi adaptado para persistir os dados de usuários, planos de estudo, quizzes e avaliações em um banco de dados MongoDB.

## Configuração e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm (gerenciador de pacotes)
- Backend da StudyPlatform (API) em execução com MongoDB configurado.

### Instalação

1.  **Clone o repositório (ou descompacte o arquivo ZIP):**
    ```bash
    # Se for um repositório git
    git clone <URL_DO_REPOSITORIO>
    cd study-frontend
    # Se for um arquivo ZIP, descompacte e navegue até a pasta
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Certifique-se de que `VITE_API_BASE_URL` aponte para a URL base da sua API de backend.

### Execução

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

- `src/`: Código fonte da aplicação React.
  - `components/`: Componentes reutilizáveis (e.g., `Layout`, `PrivateRoute`).
  - `context/`: Contexto global da aplicação (`AppContext.jsx`) para gerenciamento de estado.
  - `pages/`: Páginas principais da aplicação (e.g., `Dashboard`, `Upload`, `Login`, `Register`).
  - `services/`: Funções para interação com a API (`api.js`, `axiosInterceptor.js`).
  - `App.jsx`: Configuração de rotas da aplicação.
  - `main.jsx`: Ponto de entrada da aplicação.
- `public/`: Arquivos estáticos.

## Rotas

- `/login`: Página de login.
- `/register`: Página de cadastro.
- `/dashboard`: Dashboard principal (requer autenticação).
- `/upload`: Página para upload de materiais (requer autenticação).
- `/study-plan`: Visualização de planos de estudo (requer autenticação).
- `/study-plan/:id`: Visualização de um plano de estudo específico (requer autenticação).
- `/quiz/:id`: Página de quiz (requer autenticação).

## Contribuição

Sinta-se à vontade para contribuir com melhorias e novas funcionalidades.
