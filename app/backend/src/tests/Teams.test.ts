import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import TeamsModel from '../database/models/teams.model';
import { teamMock, teamsMock } from '../mocks/team.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Teams testes', function(){
  let findAllStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });

  it('Verifique se a lista de todos os times está completa', async function(){
    findAllStub = sinon.stub(TeamsModel, 'findAll').resolves(teamsMock as any);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teamsMock);
  });

  it('Confirme se a equipe associada a uma ID específica está sendo retornada', async function(){
    findByPkStub = sinon.stub(TeamsModel, 'findByPk').resolves(teamMock as any);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teamMock);
  });

  it('Erro 404 para time inexistente', async function(){
    findByPkStub = sinon.stub(TeamsModel, 'findByPk').resolves(null);
  
    const response = await chai.request(app).get('/teams/999');
  
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ message: 'Team not found' });
  });
});