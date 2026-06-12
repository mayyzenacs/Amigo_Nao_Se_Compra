<div align="center">

# Amigo Não Se Compra 🐾

**Conectando instituições comprometidas com apoiadores da causa animal**

![Build Status](https://img.shields.io/github/actions/workflow/status/mayyzenacs/amigo_nao_se_compra/deploy.yaml?label=deploy&logo=github&style=flat-square)
![.NET](https://img.shields.io/badge/.NET-10-blue?logo=.net&style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&style=flat-square)
![Nginx](https://img.shields.io/badge/Nginx-Proxy-green?logo=nginx&style=flat-square)

[visite o site](https://amigonaosecompra.mayradev.me/)

</div>

Uma plataforma dedicada a conectar protetores e ONGs de animais a pessoas que buscam adotar e doar, combatendo o comércio irresponsável e promovendo a adoção consciente.

Esta plataforma foi desenvolvida para o projeto de extensão universitário de Engenharia de Software. 

## Stack Tecnológica

### Backend
* **.NET 10:** MinimalAPI completa com autentificação JWT.
* **Entity Framework Core:** ORM com migrations.
* **SQLite:** Banco de dados leve e compacto escolhido pelo desafio de subir o site em uma VPS de apenas 512MB de ram.

### Frontend
* **React 19, Typescript, Tailwind CSS**

### Infraestrutura & DevOps
* **Docker Compose:** Multi-stage integrando os serviços.
* **Nginx:** Proxy reverso e servidor web apoiado por um Nginx Master container na VPS.
* **GitHub Actions:** Pipeline de CI/CD automatizado.
* **Cloudflare:** Camada de segurança e aceleração (DNS, Proxy e Web Analytics).
