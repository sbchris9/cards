import request from 'supertest';
import { createApp } from '../app';
import { Express } from 'express';

const username = 'bob@bob.bob';
const password = 'bobbobbbb';

let app: Express;
let accessToken: string;

function makeGqlCall(query: string) {
  return request(app)
    .post('/graphql')
    .set('Accept', 'application/json')
    .send({
      query
    })
    .expect('Content-Type', /json/);
}

function makeAuthGqlCall(query: string) {
  return makeGqlCall(query).set('Authorization', `bearer ${accessToken}`);
}

beforeAll(async () => {
  app = await createApp();
});

test('1+1', () => {
  expect(1 + 1).toBe(2);
});

describe('User', () => {
  it('Should register successfully with json', async () => {
    const { body } = await makeGqlCall(`
        mutation {
          register(username: "${username}", password: "${password}", terms: true)
        }
      `).expect(200);

    expect(body.data.register).toBe(true);
  });

  it('Should login successfully', async () => {
    const { body } = await makeGqlCall(`
        mutation {
          login(username: "${username}", password: "${password}")
          {
            accessToken
          }
        }
      `).expect(200);

    accessToken = body.data.login.accessToken;
    expect(typeof accessToken).toBe('string');
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it('Should get their username if authed', async () => {
    const { body } = await makeAuthGqlCall(`
        {
          me
          {
            username
          }
        }
      `).expect(200);

    expect(body.data.me.username).toBe(username);
  });

  //
  // ─── BOARD OPERATIONS ───────────────────────────────────────────────────────────
  //

  let boardId: string;
  let rowId: string;
  let cardId: string;

  it('Should be able to create board', async () => {
    const { body } = await makeAuthGqlCall(`
        mutation {
          createBoard (boardData: {name: "My_Board"})
          {
            id
            name
            position
          }
        }
      `).expect(200);

    boardId = body.data.createBoard.id;

    expect(body.data.createBoard.name).toBe('My_Board');
    expect(body.data.createBoard.position).toBe(1);
  });

  it('Should be able to create row', async () => {
    const { body } = await makeAuthGqlCall(`
        mutation {
          createRow (boardId: "${boardId}" position: 0)
          {
            id
            position
          }
        }
      `).expect(200);

    rowId = body.data.createRow.id;
    expect(typeof rowId).toBe('string');
    expect(rowId.length).toBeGreaterThan(0);
  });

  it('Should be able to create card', async () => {
    const { body } = await makeAuthGqlCall(`
        mutation {
          createCard (rowId: "${rowId}", cardData: {title: "Card_1", position: 0})
          {
            id
            title
            position
          }
        }
      `).expect(200);

    cardId = body.data.createCard.id;
    expect(typeof cardId).toBe('string');
    expect(cardId.length).toBeGreaterThan(0);
    expect(body.data.createCard.title).toBe('Card_1');
  });
});
