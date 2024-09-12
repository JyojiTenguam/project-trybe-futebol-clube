import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Login testes', function(){
  afterEach(() => {
    sinon.restore();
  });
  it('Verifica se o login com dados válidos retorna um token', async function() {
    const loginData = { email: 'admin@admin.com', password: 'secret_admin' };
    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('Verifica se o login com email inválido retorna status 401', async function() {
    const loginData = { email: 'wrongemail@admin.com', password: 'secret_admin' };
    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Verifica se o login com senha incorreta retorna status 401', async function() {
    const loginData = { email: 'admin@admin.com', password: 'wrong_password' };
    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('Verifica se o login sem email retorna status 400', async function() {
    const loginData = { password: 'secret_admin' };
    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('Verifica se o login sem senha retorna status 400', async function() {
    const loginData = { email: 'admin@admin.com' };
    const response = await chai.request(app).post('/login').send(loginData);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });
});