const sequelize = require('../models/db');
const dataMaterias = require('../models/dataMaterias.js');

class AuxiliadorEstudos {
    constructor() {
        this.sequelize = sequelize;
        this.dataMaterias = dataMaterias;
    }

    async criarMateria(dadosMateria) {
        try {
            const materia = await this.dataMaterias.create(dadosMateria);
            return materia;
        } catch (error) {
            console.error('Erro ao criar matéria:', error);
            throw error;
        }
    }

    async buscarMaterias() {
        try {
            const materias = await this.dataMaterias.findAll();
            return materias;
        } catch (error) {
            console.error('Erro ao buscar matérias:', error);
            throw error;
        }
    }

    async buscarMateria(id) {
        try {
            const materia = await this.dataMaterias.findByPk(id);
            return materia
        } catch (error) {
            console.error('Erro ao buscar matéria:', error);
            throw error;
        }
    }

    async deletarMateriaPorNome(nome) {
        try {
            const materiaExistente = await this.dataMaterias.findOne({
                where: { 
                    'materia.nome': nome 
                }
            });
            
            if (!materiaExistente) {
                throw new Error('Matéria não encontrada');
            }
            
            const deleted = await this.dataMaterias.destroy({
                where: { 
                    'materia.nome': nome 
                }
            });
            
            return deleted > 0;
            
        } catch (error) {
            console.error('Erro ao deletar matéria por nome:', error);
            throw error;
        }
    }

    async atualizarNotaMateria(id, novaNota) {
        try {
            const materiaExistente = await this.buscarMateria(id);
            
            if (!materiaExistente) {
                throw new Error('Matéria não encontrada');
            }
            
            const dadosAtualizados = {
                ...materiaExistente.materia, 
                nota: novaNota               
            };
            
            const [updated] = await this.dataMaterias.update(
                { materia: dadosAtualizados },
                { where: { id } }
            );
            
            return updated > 0;
            
        } catch (error) {
            console.error('Erro ao atualizar nota da matéria:', error);
            throw error;
        }
    }

    async adicionar_sessao_estudos(id, quantidade_horas) {
        try {
            const materiaExistente = await this.buscarMateria(id);
            
            if (!materiaExistente) {
                throw new Error('Matéria não encontrada');
            }
            
            const dataAtual = new Date().toISOString().split('T')[0];
            
            const diasQuantidadeAtual = materiaExistente.materia.dias_quantidade || {};
            
            const horasHoje = diasQuantidadeAtual[dataAtual] || 0;
            const novasHorasHoje = horasHoje + quantidade_horas;
            
            const dadosAtualizados = {
                ...materiaExistente.materia,
                dias_quantidade: {
                    ...diasQuantidadeAtual,
                    [dataAtual]: novasHorasHoje
                }
            };
            
            const [updated] = await this.dataMaterias.update(
                { materia: dadosAtualizados },
                { where: { id } }
            );
            
            return updated > 0;
            
        } catch (error) {
            console.error('Erro ao adicionar sessão de estudos:', error);
            throw error;
        }
    }

    async inicializarBanco() {
        try {
            await sequelize.authenticate();
            await this.sequelize.sync();
        } catch (error) {
            console.error('Erro ao sincronizar banco:', error);
            throw error;
        }
    }
}

module.exports = AuxiliadorEstudos;