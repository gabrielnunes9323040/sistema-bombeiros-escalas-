# 🚒 Sistema de Escala - Bombeiros Comunitários

Sistema automatizado para escolha de escalas de serviço dos Bombeiros Comunitários de Morro da Fumaça/SC.

## 📋 Pré-requisitos

### 1. Instalar Node.js
- Baixe em: https://nodejs.org/
- Escolha a versão LTS (recomendada)
- Instale com configurações padrão

### 2. Verificar Instalação
Abra o prompt de comando e digite:
```bash
node --version
npm --version
```

## 🚀 Instalação do Sistema

### Opção 1: Instalação Automática (Windows)
1. Baixe todos os arquivos do sistema
2. Execute o arquivo `install.bat`
3. Aguarde a instalação automática
4. O sistema iniciará automaticamente

### Opção 2: Instalação Manual

#### Passo 1: Estrutura de Pastas
Crie a seguinte estrutura:
```
sistema-bombeiros/
├── server.js
├── package.json
├── public/
│   └── index.html
└── escalas/
```

#### Passo 2: Instalar Dependências
```bash
cd sistema-bombeiros
npm install
```

#### Passo 3: Configurar Arquivos
1. Cole o código do `server.js` no arquivo server.js
2. Cole o código do `package.json` no arquivo package.json
3. Salve o HTML do sistema como `public/index.html`

#### Passo 4: Iniciar Servidor
```bash
npm start
```

## 🖥️ Acessando o Sistema

Após iniciar o servidor:
- Abra o navegador
- Acesse: `http://localhost:3000`
- O sistema estará funcionando!

## 📁 Onde Ficam os Arquivos Gerados

Os arquivos de escala são salvos em:
```
sistema-bombeiros/escalas/
├── escala_2025-06-21.csv           # Formato Excel
├── escala_formatada_2025-06-21.txt # Formato texto
└── escala_2025-06-21T10-30-00.json # Dados completos
```

## 🔧 Configurações Avançadas

### Alterar Porta do Servidor
No arquivo `server.js`, linha 7:
```javascript
const PORT = 3000; // Altere para porta desejada
```

### Configurar para Rede Local
Para acessar de outros computadores na rede:

1. No `server.js`, altere a linha final:
```javascript
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://SEU-IP:${PORT}`);
});
```

2. Descubra seu IP:
```bash
ipconfig
```

3. Acesse de outros computadores: `http://SEU-IP:3000`

## 🌐 Hospedagem na Internet

### Opção 1: Heroku (Gratuito)
1. Crie conta no Heroku
2. Instale Heroku CLI
3. Execute:
```bash
heroku create sistema-bombeiros-mfu
git init
git add .
git commit -m "Sistema inicial"
git push heroku main
```

### Opção 2: Railway (Simples)
1. Conecte seu GitHub no Railway
2. Faça deploy automático
3. Configure domínio personalizado

### Opção 3: VPS Próprio
Para hospedagem profissional:
- Contrate VPS (DigitalOcean, AWS, etc.)
- Instale Node.js no servidor
- Configure PM2 para manter sistema rodando
- Configure Nginx como proxy reverso

## 🔒 Segurança

### Para Uso Local
- Sistema seguro para rede interna
- Não exponha porta 3000 na internet

### Para Uso na Internet
Adicione autenticação:
```javascript
// Middleware de autenticação simples
app.use((req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || auth !== 'Bearer SENHA-SECRETA') {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
});
```

## 🆘 Solução de Problemas

### Erro: "Porta já em uso"
```bash
# Matar processo na porta 3000
npx kill-port 3000
```

### Erro: "node não reconhecido"
- Reinstale Node.js
- Reinicie o computador
- Adicione Node.js ao PATH

### Erro: "npm não encontrado"
- Node.js foi instalado incorretamente
- Baixe novamente do site oficial

### Arquivos não são salvos
- Verifique permissões da pasta `escalas/`
- Execute como administrador se necessário

## 📞 Suporte

Para dúvidas técnicas:
1. Verifique este README
2. Consulte logs do servidor no terminal
3. Teste em modo de desenvolvimento

## 🎯 Próximos Passos

Após instalar e testar:
1. ✅ Treine alguns bombeiros no sistema
2. ✅ Faça backup dos dados importantes
3. ✅ Configure rotina de backup automático
4. ✅ Considere hospedagem na nuvem para acesso remoto

---

**Desenvolvido para Bombeiros Comunitários - Morro da Fumaça/SC**
*Sistema de código aberto - Pode ser modificado conforme necessidade*