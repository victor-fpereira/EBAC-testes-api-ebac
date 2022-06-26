/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'
// Importando como módulo ES6
import { faker as _faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
     cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
      })
    });

    it('Deve listar usuários cadastrados', () => {
     cy.request({
          method: 'GET',
          url: 'usuarios'
      }).then((response) => {
          //expect(response.body.produtos[9].nome).to.equal('Produto EBAC 436746')
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
          expect(response.duration).to.be.lessThan(20)
      })
    });

    it('Deve cadastrar um usuário com sucesso', () => {

     let adminstrador = 'false'

     cy.cadastrarUsuario(adminstrador).then((response) => {
         expect(response.status).to.equal(201)
         expect(response.body.message).to.equal('Cadastro realizado com sucesso')
     })
    });

    it('Deve validar um usuário com email inválido', () => {
          cy.request('usuarios').then(response => {
               let email = response.body.usuarios[0].email
               cy.request({
                    method: 'POST',
                    url: 'usuarios',
                    body: {
                        "nome": _faker.name.firstName(),
                        "email": email,
                        "password": _faker.internet.password(),
                        "administrador": 'false'
                    },
                    failOnStatusCode: false
                }).then(response => {
                    expect(response.body.message).to.equal('Este email já está sendo usado')
                    expect(response.status).to.equal(400)
                })
          })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                   method: 'PUT', 
                   url: `usuarios/${id}`,
                   body:
                   {
                    "nome": _faker.name.firstName(),
                    "email": _faker.internet.email(),
                    "password": _faker.internet.password(),
                    "administrador": 'false'
                  }
               }).then(response => {
                   expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
           })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
          let administrador = 'false'
          cy.cadastrarUsuario(administrador).then(response => {
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${response.body._id}`,
               }).then(response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
    });
});
