# ⚽ Trybe Futebol Clube

Uma API RESTful com autenticação JWT, desenvolvida em TypeScript e estruturada em MSC (Model-Service-Controller), que simula uma tabela de partidas de futebol. A aplicação permite cadastrar partidas, atualizar resultados, autenticar usuários e consultar classificação de clubes.

## ✨ Demonstração

> Projeto sem interface visual. A aplicação pode ser testada via requisições HTTP (com ferramentas como Insomnia ou Postman) e por testes automatizados.

## 📋 Índice

- [Sobre](#-sobre)
- [Habilidades desenvolvidas](#-habilidades-desenvolvidas)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Como rodar o projeto](#-como-rodar-o-projeto)
- [Autor](#-autor)

## 💡 Sobre

Neste projeto foi construída uma API para gerenciamento de partidas de futebol, com autenticação e rotas protegidas. A aplicação aplica os princípios de Programação Orientada a Objetos e arquitetura MSC, além de utilizar banco de dados relacional com Sequelize.

## 🛠️ Habilidades desenvolvidas

- Desenvolver uma API com CRUD completo usando TypeScript
- Estruturar a aplicação utilizando a arquitetura MSC
- Integrar ORM Sequelize para manipulação de banco de dados MySQL
- Implementar autenticação e autorização com JWT
- Criar rotas protegidas
- Utilizar práticas de boas validações com JOI
- Desenvolver testes automatizados com Mocha, Chai e Sinon

## 🧪 Tecnologias utilizadas

- TypeScript
- Node.js
- Express.js
- Sequelize
- JWT
- JOI
- MySQL
- Docker
- Mocha, Chai e Sinon

## 🚀 Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/tryber/project-trybe-futebol-clube.git
```

2. Acesse a pasta do projeto

```bash
cd project-trybe-futebol-clube
```

3. Instale as dependências do front-end e do back-end

```bash
npm run install:apps
```

🐳 Rodando com Docker

Para iniciar os containers (back-end, front-end e banco de dados)
```bash
npm run compose:up
```
>A aplicação estará disponível em http://localhost:3000 (front-end) e http://localhost:3001 (back-end).

Para derrubar os containers
```bash
npm run compose:down
```

Para visualizar os logs em tempo real
```bash
npm run logs
```


## 👤 Autor

Este projeto foi desenvolvido como parte do curso de Desenvolvimento Web da Trybe, por Jyoji Tenguam.


```
Falta um requisito de 100% de cobertura de teste.
