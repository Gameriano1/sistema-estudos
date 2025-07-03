const inquirer = require('inquirer');
const ApiServer = require('./src/api.js');
const TerminalEstudos = require('./src/terminal.js');

class Programa {

    async main() {
        const { acao } = await inquirer.prompt([
            {
                type: 'list',
                name: 'acao',
                message: 'O que você quer fazer?',
                choices: [
                    'Iniciar Terminal',
                    'Iniciar API',
                    'Sair'
                ]
            }
        ]);
        
        if (acao === 'Sair') {
            console.log('Tchau, tenha um bom dia.');
            return;
        }
        
        await this.executarAcao(acao);
    }

    async executarAcao(acao) {
        // Limpa o terminal antes de executar qualquer ação
        console.clear();
        
        switch (acao) {
            case 'Iniciar Terminal':
                await this.rodarTerminal();
                break;
            case 'Iniciar API':
                await this.rodarAPI();
                break;
        }
    }

    async rodarAPI(){
        const ApiServer = require('./src/api.js');
        const api = new ApiServer(3000);
        api.iniciar();
    }

    async rodarTerminal(){
        const TerminalEstudos = require('./src/terminal.js');
        const terminal = new TerminalEstudos();
        terminal.iniciar().catch(console.error);
    }
}

new Programa().main();
