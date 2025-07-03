# Sistema de Estudos - Documentação

## Visão Geral

O **Sistema de Estudos** é uma aplicação Node.js projetada para auxiliar estudantes no acompanhamento de seus estudos e notas acadêmicas. O sistema oferece duas interfaces principais: uma interface de linha de comando (terminal) e uma API REST, permitindo aos usuários gerenciar suas matérias, registrar sessões de estudos e acompanhar seu progresso.

## Funcionalidades Principais

### Interface Terminal

- **Adicionar nova matéria**: Permite cadastrar novas matérias com nome e nota atual
- **Estudar matéria existente**: Registra sessões de estudos com quantidade de horas e atualiza notas
- **Ver progresso**: Exibe estatísticas de estudos incluindo dias estudados, total de horas e média por dia
- **Matérias pré-definidas**: Lista com disciplinas comuns como Matemática, Português, História, etc.


### API REST

- **GET /sistemaestudos/v1.0/Sessoes**: Retorna todas as matérias com estatísticas de estudos
- **POST /sistemaestudos/v1.0/Sessao**: Cria uma nova matéria
- **DELETE /sistemaestudos/v1.0/Sessao/:nome**: Remove uma matéria específica


## Estrutura do Projeto

```
sistema-estudos/
├── src/
│   ├── api.js          # Servidor API REST
│   ├── classes.js      # Classe auxiliar para operações de banco
│   └── terminal.js     # Interface de linha de comando
├── models/
│   ├── db.js           # Configuração do banco SQLite
│   └── dataMaterias.js # Modelo de dados das matérias
├── constructors/
│   └── materiaModel.js # Modelo de classe Materia
├── index.js            # Ponto de entrada da aplicação
├── package.json        # Configurações e dependências
└── .gitignore          # Arquivos ignorados pelo Git
```


## Tecnologias Utilizadas

- **Node.js** - Plataforma de execução JavaScript
- **Express.js** - Framework web para API REST
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados local
- **Inquirer.js** - Interface interativa de linha de comando
- **CORS** - Middleware para cross-origin requests
- **Helmet** - Middleware de segurança
- **Morgan** - Logger HTTP


## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 12 ou superior)
- NPM (gerenciador de pacotes)


### Passos para Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/Gameriano1/sistema-estudos.git
cd sistema-estudos
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Execute a aplicação**:
```bash
node index.js
```


## Como Usar

### Executando o Sistema

Ao executar `node index.js`, você verá um menu com as seguintes opções:

- **Iniciar Terminal**: Abre a interface de linha de comando
- **Iniciar API**: Inicia o servidor REST na porta 3000
- **Sair**: Encerra a aplicação


### Interface Terminal

#### 1. Adicionar Nova Matéria

- Escolha entre matérias pré-definidas ou digite uma nova
- Informe sua nota atual na matéria
- A matéria será salva no banco de dados


#### 2. Estudar Matéria Existente

- Selecione uma matéria cadastrada
- Informe quantas horas estudou
- Atualize sua nota atual
- O sistema registra a sessão de estudos com data e hora


#### 3. Ver Progresso

- Visualize estatísticas de todas as matérias
- Informações incluem: dias estudados, total de horas, média de horas por dia e nota atual


### API REST

#### Endpoints Disponíveis

**GET /sistemaestudos/v1.0/Sessoes**

- Retorna todas as matérias com estatísticas
- Resposta exemplo:

```json
{
  "materias": [
    {
      "nome": "Matemática",
      "diasEstudados": 5,
      "totalHoras": 12.5,
      "mediaHoras": 2.5,
      "nota": 8.5
    }
  ]
}
```

**POST /sistemaestudos/v1.0/Sessao**

- Cria uma nova matéria
- Corpo da requisição:

```json
{
  "materia": "Física",
  "nota": 7.5
}
```

**DELETE /sistemaestudos/v1.0/Sessao/:nome**

- Remove uma matéria específica
- Parâmetro: nome da matéria na URL


## Estrutura de Dados

### Modelo de Matéria

```javascript
{
  nome: "Nome da Matéria",
  nota: 8.5,
  dias_quantidade: {
    "2025-01-01": 2.5,
    "2025-01-02": 3.0
  },
  criadoEm: "2025-01-01T10:00:00.000Z"
}
```


### Banco de Dados

- **Tipo**: SQLite
- **Arquivo**: `database.sqlite` (criado automaticamente)
- **Tabela**: `boletim` - armazena informações das matérias em formato JSON


## Configuração do Ambiente

### Variáveis de Ambiente

O sistema utiliza as seguintes variáveis de ambiente:

- `PORT`: Porta do servidor API (padrão: 3000)


### Arquivos de Configuração

- **package.json**: Configurações do projeto e dependências
- **.gitignore**: Arquivos ignorados pelo controle de versão


## Segurança

A API implementa as seguintes medidas de segurança:

- **Helmet**: Configura headers de segurança HTTP
- **CORS**: Controla o acesso cross-origin
- **Validação de entrada**: Verificação de dados obrigatórios
- **Tratamento de erros**: Respostas adequadas para diferentes tipos de erro


## Limitações e Considerações

1. **Banco de dados local**: Utiliza SQLite, adequado para uso individual
2. **Sem autenticação**: A API não implementa sistema de autenticação
3. **Dados em memória**: Não há persistência de configurações entre execuções da interface terminal
4. **Validação básica**: Validações de entrada são simples e podem ser expandidas

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste adequadamente
5. Faça um pull request

## Licença

Este projeto está licenciado sob a **MIT License**.

## Autor

**Leoni Frazão** - Desenvolvedor principal do sistema

## Suporte

Para dúvidas ou problemas:

- Abra uma issue no repositório GitHub
- Verifique a documentação do código-fonte
- Consulte os logs de erro para diagnóstico

<div style="text-align: center">⁂</div>

