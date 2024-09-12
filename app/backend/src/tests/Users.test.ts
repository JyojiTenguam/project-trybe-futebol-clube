import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import JWT from '../utils/jwt.util';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Users testes', function() {
  afterEach(() => {
    sinon.restore();
  });

  it('Retorno correto de dados com token válido', async function() {
    const falseTokenPayload = { id: 1, email: 'admin@admin.com', role: 'admin' };
    sinon.stub(JWT, 'verify').returns(falseTokenPayload);

    const response = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', 'Bearer fake_token');

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('role', 'admin');
  });

  it('Resposta 401 para solicitação sem token', async function() {
    const response = await chai.request(app).get('/login/role');

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({ message: 'Token not found' });
  });

  it('Verifica se ao fornecer token inválido retorna status 401', async function() {
    const invalidToken = 'token_invalido';
    const response = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response).to.have.status(401);
    expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
  });
});