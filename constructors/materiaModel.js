class Materia {
  constructor(nome, nota, dias_quantidade) {
    this.nome = nome;
    this.nota = nota;
    this.dias_quantidade = dias_quantidade;
    this.criadoEm = new Date();
  }

  toJSON() {
    return {
      materia: {
        nome: this.nome,
        nota: this.nota,
        dias_quantidade: this.dias_quantidade,
        criadoEm: this.criadoEm.toISOString()
      }
    };
  }

  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    return new Materia(data.nome, data.nota, data.idade);
  }
}

module.exports = Materia;