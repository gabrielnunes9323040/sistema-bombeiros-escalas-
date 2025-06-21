// server.js - Servidor Node.js para hospedar o sistema
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Arquivos estáticos (HTML, CSS, JS)

// Rota para salvar escala
app.post('/api/salvar-escala', (req, res) => {
    try {
        const { escala, bombeiros, rodada, timestamp } = req.body;
        
        // Criar diretório se não existir
        if (!fs.existsSync('escalas')) {
            fs.mkdirSync('escalas');
        }
        
        // Nome do arquivo com data/hora
        const dataHora = new Date().toISOString().replace(/[:.]/g, '-');
        const nomeArquivo = `escala_${dataHora}.json`;
        
        // Salvar dados completos
        const dadosCompletos = {
            timestamp: new Date().toISOString(),
            rodada,
            escala,
            bombeiros,
            metadados: {
                totalServicos: Object.keys(escala).length,
                bombeirosMaisAtivos: bombeiros
                    .sort((a, b) => b.servicos - a.servicos)
                    .slice(0, 5)
            }
        };
        
        fs.writeFileSync(`escalas/${nomeArquivo}`, JSON.stringify(dadosCompletos, null, 2));
        
        // Gerar arquivo Excel-like
        gerarArquivoEscala(escala, bombeiros);
        
        res.json({ 
            success: true, 
            arquivo: nomeArquivo,
            message: 'Escala salva com sucesso!' 
        });
        
    } catch (error) {
        console.error('Erro ao salvar escala:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Função para gerar arquivo no formato da sua planilha original
function gerarArquivoEscala(escala, bombeiros) {
    const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
                       'quinta-feira', 'sexta-feira', 'sábado'];
    
    let conteudo = 'ESCALA BBCC - JUNHO 2025\n';
    conteudo += 'NÃO REMUNERADO Antiguidade NOME Nº serviços\n';
    conteudo += 'DIA VAGA DIURNA 1 VAGA DIURNA 2 VAGA NOTURNA 1 VAGA NOTURNA 2 DIURNO NOTURNO\n\n';
    
    // Gerar escala por dia
    for (let dia = 1; dia <= 30; dia++) {
        const data = new Date(2025, 5, dia);
        const nomeDia = diasSemana[data.getDay()];
        
        const diurno1 = escala[`${dia}-diurno`] || '';
        const diurno2 = ''; // Caso tenha 2 vagas diurnas
        const noturno1 = escala[`${dia}-noturno`] || '';
        const noturno2 = ''; // Caso tenha 2 vagas noturnas
        
        conteudo += `${dia} ${nomeDia} ${diurno1} ${diurno2} ${noturno1} ${noturno2}\n`;
    }
    
    // Adicionar resumo de bombeiros
    conteudo += '\n--- RESUMO POR BOMBEIRO ---\n';
    bombeiros.forEach(bombeiro => {
        conteudo += `${bombeiro.nome} - ${bombeiro.servicos} serviços\n`;
    });
    
    // Salvar arquivo
    const dataAtual = new Date().toISOString().split('T')[0];
    fs.writeFileSync(`escalas/escala_formatada_${dataAtual}.txt`, conteudo);
    
    // Gerar CSV para Excel
    gerarCSVEscala(escala, bombeiros);
}

// Gerar CSV compatível com Excel
function gerarCSVEscala(escala, bombeiros) {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    let csv = 'Dia,Data,Dia da Semana,Diurno 1,Diurno 2,Noturno 1,Noturno 2\n';
    
    for (let dia = 1; dia <= 30; dia++) {
        const data = new Date(2025, 5, dia);
        const nomeDia = diasSemana[data.getDay()];
        
        const diurno1 = escala[`${dia}-diurno`] || '';
        const diurno2 = ''; // Para futuras expansões
        const noturno1 = escala[`${dia}-noturno`] || '';
        const noturno2 = '';
        
        csv += `${dia},${dia}/06/2025,${nomeDia},"${diurno1}","${diurno2}","${noturno1}","${noturno2}"\n`;
    }
    
    const dataAtual = new Date().toISOString().split('T')[0];
    fs.writeFileSync(`escalas/escala_${dataAtual}.csv`, csv);
}

// Rota para listar escalas salvas
app.get('/api/escalas', (req, res) => {
    try {
        if (!fs.existsSync('escalas')) {
            return res.json([]);
        }
        
        const arquivos = fs.readdirSync('escalas')
            .filter(arquivo => arquivo.endsWith('.json'))
            .map(arquivo => {
                const stats = fs.statSync(`escalas/${arquivo}`);
                return {
                    nome: arquivo,
                    data: stats.mtime,
                    tamanho: stats.size
                };
            })
            .sort((a, b) => b.data - a.data);
            
        res.json(arquivos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para download de arquivos
app.get('/api/download/:arquivo', (req, res) => {
    const arquivo = req.params.arquivo;
    const caminho = path.join(__dirname, 'escalas', arquivo);
    
    if (fs.existsSync(caminho)) {
        res.download(caminho);
    } else {
        res.status(404).json({ error: 'Arquivo não encontrado' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚒 Servidor Bombeiros rodando em http://localhost:${PORT}`);
    console.log(`📁 Escalas salvas em: ${path.join(__dirname, 'escalas')}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Encerrando servidor...');
    process.exit(0);
});
