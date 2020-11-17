import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup Controller', () => {
  test('deve retornar 400 se o nome nao for fornecido', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        email: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('deve retornar 400 se o email nao for fornecido', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'exemplo@email.com',
        password: 'exemplo12345',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('deve retornar 400 se o password nao for fornecido', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        passwordConfirm: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('deve retornar 400 se o passwordConfirm nao for fornecido', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'exemplo12345'
      }
    }
    const httpResponse = sut.handle(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
})
test('deve retornar 400 se o email for invalido', () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

  const httpResquest = {
    body: {
      name: 'exemplo@email.com',
      email: 'fulano@email.com',
      password: 'exemplo12345',
      passwordConfirm: 'exemplo12345'
    }
  }
  const httpResponse = sut.handle(httpResquest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidParamError('email'))
})
