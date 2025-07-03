const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const AuxiliadorEstudos = require('./classes.js');
const Materia = require("../constructors/materiaModel.js");
const { json } = require('sequelize');

class ApiServer {
    constructor(port = 3000) {
        this.app = express();
        this.PORT = process.env.PORT || port;
        this.configurarMiddlewares();
        this.configurarRotasBasicas();

        this.auxiliador = new AuxiliadorEstudos();
        
    }

    configurarMiddlewares() {
        // Middlewares
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(morgan('combined'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    configurarRotasBasicas() {
        this.app.get('/sistemaestudos/v1.0/Sessoes', async (req, res) => {
            try {
                let jsonFinal = {"materias": []};
                const materias = await this.auxiliador.buscarMaterias();
            
                if (materias.length === 0) {
                    console.log('Nenhuma matéria cadastrada ainda.');
                } else {
                    materias.forEach((materia) => {
                        const diasQuantidade = materia.materia.dias_quantidade || {};
                        const diasEstudados = Object.keys(diasQuantidade).length;
                        const totalHoras = Object.values(diasQuantidade).reduce((sum, horas) => sum + horas, 0);
                        const mediaHoras = diasEstudados > 0 ? (totalHoras / diasEstudados).toFixed(1) : 0;
                        
                        jsonFinal.materias.push({
                            nome: materia.materia.nome,
                            diasEstudados: diasEstudados,
                            totalHoras: totalHoras,
                            mediaHoras: parseFloat(mediaHoras),
                            nota: materia.materia.nota || 'N/A'
                        })
                    });
                }

                res.json(jsonFinal);
            } catch (error) {
                console.error('Erro ao buscar matérias:', error);
                res.status(500).json({ 
                    message: 'Erro interno do servidor',
                    error: error.message 
                });
            }
        });

        this.app.post('/sistemaestudos/v1.0/Sessao', async (req, res) => {
            try {
                const { materia, nota } = req.body;
                
                if (!materia || !nota) {
                    return res.status(400).json({
                        message: 'Campos obrigatórios não fornecidos',
                        required: ['materia', 'nota']
                    });
                }

                if (typeof nota !== 'number' || nota <= 0) {
                    return res.status(400).json({
                        message: 'nota deve ser um número positivo'
                    });
                }

                // let nota = parseFloat(nota_atual) || 0;
                let modelomateria = new Materia(materia, nota, {});
                
                let resultado = await this.auxiliador.criarMateria(modelomateria.toJSON());

                res.status(200).json({
                    message: 'Sessão de estudo criada com sucesso',
                    sessao: resultado
                });

            } catch (error) {
                console.error('Erro ao criar sessão de estudo:', error);
                res.status(500).json({
                    message: 'Erro interno do servidor',
                    error: error.message
                });
            }
        });


        this.app.delete('/sistemaestudos/v1.0/Sessao/:nome', async (req, res) => {
            try {
                const { nome } = req.params;
                
                if (!nome) {
                    return res.status(400).json({
                        message: 'Nome da matéria é obrigatório',
                        required: ['nome']
                    });
                }

                // Verificar se a matéria existe antes de tentar deletar
                const materias = await this.auxiliador.buscarMaterias();
                const materiaExiste = materias.find(m => m.materia.nome === nome);
                
                if (!materiaExiste) {
                    return res.status(404).json({
                        message: 'Matéria não encontrada',
                        nome: nome
                    });
                }

                // Assumindo que existe um método deletarMateria na classe AuxiliadorEstudos
                const resultado = await this.auxiliador.deletarMateriaPorNome(nome);

                res.status(200).json({
                    message: 'Matéria deletada com sucesso',
                    nome: nome,
                    resultado: resultado
                });

            } catch (error) {
                console.error('Erro ao deletar matéria:', error);
                res.status(500).json({
                    message: 'Erro interno do servidor',
                    error: error.message
                });
            }
        });


        this.app.get('/', (req, res) => {
            res.json({ 
                message: 'API funcionando!',
                version: '1.0.0'
            });
        });
    }

    async iniciar() {
        await this.auxiliador.inicializarBanco();
        this.app.listen(this.PORT, () => {
            console.log(`Servidor rodando na porta ${this.PORT}`);
        });
    }

    get aplicacao() {
        return this.app;
    }
}

module.exports = ApiServer;
