import { emailValido, validarCadastro, validarLogin } from '@/utils/validacao';

describe('validação', () => {
  test('e-mail', () => {
    expect(emailValido('aluno@escola.com')).toBe(true);
    expect(emailValido('aluno@')).toBe(false);
  });

  test('login exige e-mail válido e senha', () => {
    expect(validarLogin('', '')).toEqual({
      email: expect.any(String),
      senha: expect.any(String),
    });
    expect(validarLogin('a@b.com', '123')).toEqual({});
  });

  test('cadastro confere senha e confirmação', () => {
    const erros = validarCadastro('Ana', 'ana@b.com', '123456', '654321');
    expect(erros.confirmacao).toBeDefined();
    expect(validarCadastro('Ana', 'ana@b.com', '123456', '123456')).toEqual({});
  });

  test('senha curta é rejeitada', () => {
    expect(validarCadastro('Ana', 'ana@b.com', '123', '123').senha).toBeDefined();
  });
});
