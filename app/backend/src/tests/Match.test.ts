import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import SequelizeMatch from '../database/models/match.model';
import { Response } from 'superagent';
import { allMatches, finishedMatches, inProgressMatches } from '../mocks/match.mock';

chai.use(chaiHttp);


const { expect } = chai;

describe('Teste de integração para o endpoint /match', () => {
  let chaiHttpResponse: Response;

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
}); 