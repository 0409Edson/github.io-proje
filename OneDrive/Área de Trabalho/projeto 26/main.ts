function multiplicar(a: number, b: number): number {
    return a * b;
}

function saudar(nome: string): string {
    return "Olá " + nome;
}

const resultadoMultiplicacao = multiplicar(5, 10);
const saudacao = saudar("Juliana");

console.log(`Resultado da multiplicação: ${resultadoMultiplicacao}`);
console.log(saudacao);
