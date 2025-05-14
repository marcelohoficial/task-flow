Coletando informações do workspace# TaskFlow - Gerenciador de Tarefas

TaskFlow é uma aplicação web desenvolvida em Angular para gerenciar tarefas de forma eficiente. O projeto utiliza boas práticas de desenvolvimento, como arquitetura modular, componentes reutilizáveis e integração com APIs RESTful. Além disso, a interface é responsiva e utiliza o TailwindCSS para estilização.

---

## Funcionalidades

### Autenticação

- **Login e Registro**: Permite que os usuários façam login ou criem uma nova conta.
- **Proteção de Rotas**: Apenas usuários autenticados podem acessar as rotas protegidas, como a lista de tarefas.

### Gerenciamento de Tarefas

- **Listagem de Tarefas**: Exibe todas as tarefas do usuário com filtros por status, prioridade e busca por título ou descrição.
- **Criação de Tarefas**: Permite criar novas tarefas com título, descrição, responsável, prioridade e data limite.
- **Edição de Tarefas**: Atualize os detalhes de uma tarefa existente.
- **Conclusão de Tarefas**: Marque tarefas como concluídas.
- **Exclusão de Tarefas**: Remova tarefas indesejadas.
- **Detalhes da Tarefa**: Visualize informações detalhadas de uma tarefa específica.

### Interface

- **Responsividade**: Interface adaptada para dispositivos móveis e desktops.
- **Feedback Visual**: Indicadores de carregamento, mensagens de erro e animações para melhorar a experiência do usuário.

---

## Pontos Fortes

1. **Arquitetura Modular**: O projeto é dividido em módulos (`auth`, `tasks`, `shared`, etc.), facilitando a manutenção e escalabilidade.
2. **Componentes Reutilizáveis**: Componentes como `HeaderComponent` e `TaskItemComponent` são reutilizáveis e seguem boas práticas de encapsulamento.
3. **Boas Práticas de Código**:
   - Uso de `RxJS` para manipulação de streams de dados.
   - Validação de formulários com `ReactiveForms`.
   - Proteção de rotas com `AuthGuard`.
4. **Estilização com TailwindCSS**: Utilização de classes utilitárias para estilização rápida e consistente.
5. **Integração com APIs RESTful**: Comunicação eficiente com o backend para operações CRUD.

---

## Boas Práticas

- **Estrutura de Diretórios**: O projeto segue uma estrutura organizada, separando responsabilidades em pastas como `core`, `features`, `shared`, etc.
- **Uso de Observables**: A aplicação utiliza `RxJS` para lidar com dados assíncronos, garantindo reatividade e performance.
- **Validação de Formulários**: Todos os formulários possuem validações robustas para garantir a integridade dos dados.
- **Responsividade**: A interface é projetada para funcionar bem em diferentes tamanhos de tela.
- **Configuração de Ambiente**: Variáveis de ambiente são separadas em arquivos como environment.ts e environment.prod.ts.

---

## Como Usar

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Angular CLI (instalado globalmente)
- Gerenciador de pacotes (npm ou yarn)

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/taskflow.git
   cd taskflow
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o backend:

   - Certifique-se de que o backend está rodando e configurado para aceitar requisições na URL definida em environment.ts.

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

5. Acesse a aplicação no navegador:
   ```
   http://localhost:4200
   ```

### Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm test`: Executa os testes (se configurados).

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/          # Serviços, modelos e guardas
│   ├── features/      # Funcionalidades principais (auth, tasks)
│   ├── shared/        # Componentes reutilizáveis
│   └── app.routes.ts  # Configuração de rotas
├── assets/            # Recursos estáticos
├── environments/      # Configurações de ambiente
├── global_styles.css  # Estilos globais
└── main.ts            # Arquivo principal
```

---

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Descrição da minha feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a MIT License.

---

Aproveite o TaskFlow para gerenciar suas tarefas de forma eficiente e organizada! 🎯
