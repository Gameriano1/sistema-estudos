const inquirer = require('inquirer');
const AuxiliadorEstudos = require('./classes.js');
const Materia = require("../constructors/materiaModel.js");

class TerminalEstudos {
    constructor() {
        this.auxiliador = new AuxiliadorEstudos();
        this.materiasComuns = [
            'Matemática', 'Português', 'História', 'Geografia',
            'Química', 'Física', 'Biologia', 'Inglês', 'Espanhol',
            'Filosofia', 'Sociologia', 'Literatura', 'Redação'
        ];
    }

    async iniciar() {
        await this.auxiliador.inicializarBanco();
        
        while (true) {
            const { acao } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'acao',
                    message: 'O que você quer fazer?',
                    choices: [
                        'Adicionar nova matéria',
                        'Estudar matéria existente',
                        'Ver progresso',
                        'Sair'
                    ]
                }
            ]);
            
            if (acao === 'Sair') {
                console.log('Tchau, tenha um bom dia.');
                break;
            }
            
            await this.executarAcao(acao);
        }
    }

    async executarAcao(acao) {
        switch (acao) {
            case 'Adicionar nova matéria':
                await this.adicionarMateria();
                break;
            case 'Estudar matéria existente':
                await this.estudarMateria();
                break;
            case 'Ver progresso':
                await this.verProgresso();
                break;
        }
    }

    async adicionarMateria() {
        const { tipoEscolha } = await inquirer.prompt([
            {
                type: 'list',
                name: 'tipoEscolha',
                message: 'Como você quer escolher a matéria?',
                choices: [
                    'Escolher da lista',
                    'Digitar nova matéria'
                ]
            }
        ]);
        
        let materia;
        
        if (tipoEscolha === 'Escolher da lista') {
            const { materiaEscolhida } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'materiaEscolhida',
                    message: 'Escolha uma matéria:',
                    choices: this.materiasComuns
                }
            ]);
            materia = materiaEscolhida;
        } else {
            const { materiaDigitada } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'materiaDigitada',
                    message: 'Digite o nome da nova matéria:',
                    validate: (input) => {
                        if (input.trim() === '') {
                            return 'O nome da matéria não pode estar vazio!';
                        }
                        return true;
                    }
                }
            ]);
            materia = materiaDigitada;
        }

        const { nota_atual } = await inquirer.prompt([
            {
                type: 'input',
                name: 'nota_atual',
                message: 'Digite a sua nota atual na matéria:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'O valor da nota não deve ser vazio';
                    }
                    return true;
                }
            }
        ]);

        let nota = parseFloat(nota_atual) || 0;
        let modelomateria = new Materia(materia, nota, {});
            
        await this.auxiliador.criarMateria(modelomateria.toJSON());
        console.log(`\n✓ Matéria "${materia}" adicionada com sucesso!\n`);
    }

    async estudarMateria() {

        const materiasDisponiveis = await this.auxiliador.buscarMaterias();
        
        if (materiasDisponiveis.length === 0) {
            console.log('Nenhuma matéria cadastrada ainda!');
            return;
        }
    
        const choices = materiasDisponiveis.map(materia => ({
            name: materia.materia.nome || `Matéria ID ${materia.id}`,
            value: materia.id
        }));
        
        const { materiaIdEscolhida } = await inquirer.prompt([
            {
                type: 'list',
                name: 'materiaIdEscolhida',
                message: 'Qual matéria você quer estudar?',
                choices: choices
            }
        ]);

        const { quantidade_horas } = await inquirer.prompt([
            {
                type: 'input',
                name: 'quantidade_horas',
                message: 'Digite quantas horas você estudou na sessão de hoje:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'O valor das horas não deve ser vazio';
                    }
                    return true;
                }
            }
        ]);

        const { nota_atual } = await inquirer.prompt([
            {
                type: 'input',
                name: 'nota_atual',
                message: 'Digite a sua nota atual na matéria:',
                validate: (input) => {
                    if (input.trim() === '') {
                        return 'O valor da nota não deve ser vazio';
                    }
                    return true;
                }
            }
        ]);
        
        let nota = parseFloat(nota_atual) || 0;

        
        const materiaSelecionada = materiasDisponiveis.find(materia => materia.id === materiaIdEscolhida);
        
        await this.auxiliador.atualizarNotaMateria(materiaIdEscolhida, nota);

        const horasNumero = parseFloat(quantidade_horas) || 0;
        await this.auxiliador.adicionar_sessao_estudos(materiaIdEscolhida, horasNumero);
        
        console.log(`\nVocê estudou ${materiaSelecionada.materia.nome}!\n`);
    }

    async verProgresso() {
        const materias = await this.auxiliador.buscarMaterias();
        
        if (materias.length === 0) {
            console.log('\nNenhuma matéria cadastrada ainda.\n');
        } else {
            console.log('\nSeu progresso: ');
            materias.forEach((materia) => {
                const diasQuantidade = materia.materia.dias_quantidade || {};
                const diasEstudados = Object.keys(diasQuantidade).length;
                const totalHoras = Object.values(diasQuantidade).reduce((sum, horas) => sum + horas, 0);
                const mediaHoras = diasEstudados > 0 ? (totalHoras / diasEstudados).toFixed(1) : 0;
                
                console.log(`${materia.materia.nome}: ${diasEstudados} dias estudados (${totalHoras}h total, média ${mediaHoras}h/dia), nota atual: ${materia.materia.nota || 'N/A'}.\n`);
            });
        }
    }
}

module.exports = TerminalEstudos;
