import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import SequelizeMatch from '../database/models/match.model';
import { Response } from 'superagent';
import { allMatches, errorMatches, finishedMatches, inProgressMatches } from '../mocks/match.mock';
import jwtUtil from '../utils/jwt.util';

chai.use(chaiHttp);


const { expect } = chai;

describe('Teste de integração para o endpoint /match', () => {
  let chaiHttpResponse: Response;
  const validToken = jwtUtil.sign({ id: 1, email: 'admin@admin.com' });

  beforeEach(function () {
    sinon.restore();
  });

  it('Status 200 - Retorna todas as partidas', async () => {
    sinon.stub(SequelizeMatch, 'findAll').resolves(allMatches as any);

    chaiHttpResponse = await chai.request(app).get('/matches')

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.deep.equal(allMatches);
  });

  it('Status 200 - Retorna todas as partidas em andamento', async () => {
    sinon.stub(SequelizeMatch, 'findAll').resolves(inProgressMatches as any);

    chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body).to.deep.equal(inProgressMatches);
    const allInProgressTrue = chaiHttpResponse.body.every((match: any) => match.inProgress === true);
    expect(allInProgressTrue).to.be.true;
  });

  it('Status 200 - Retorna todas as partidas finalizadas', async () => {
    sinon.stub(SequelizeMatch, 'findAll').resolves(finishedMatches as any);

    chaiHttpResponse = await chai.request(app).get(`/matches?inProgress=false`);

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(finishedMatches);
    expect(chaiHttpResponse.body).to.be.an('array');
    const allInProgressFalse = chaiHttpResponse.body.every((match: any) => match.inProgress === false);
    expect(allInProgressFalse).to.be.true;
  });

  it('Status 404 - Não encontrou a partida', async () => {
    const matchId = 1;
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);

    chaiHttpResponse = await chai.request(app).patch(`/matches/${matchId}`).set('Authorization', `token ${validToken}`).send(finishedMatches[0]);

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Match not found' });
  });

  it('Status 404 - Não encontrou o time da casa', async () => {
    sinon.stub(SequelizeMatch, 'create').resolves(errorMatches[0] as any);
    sinon.stub(SequelizeMatch, 'findByPk').resolves(null);

    chaiHttpResponse = await chai.request(app).post(`/matches`).set('Authorization', `token ${validToken}`).send(errorMatches[0]);

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'There is no team with such id!' });
  });
}); 