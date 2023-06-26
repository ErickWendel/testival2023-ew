import { describe, it, beforeEach, expect } from '@jest/globals'
import supertest from 'supertest'
import portfinder from 'portfinder'

import { app } from '../index.js'
const getAvailablePort = portfinder.getPortPromise

async function getUsersActivity(testServer) {
    return testServer
        .get('/register')
        .expect('Content-Type', /json/)

}
async function registerActivity(testServer, data) {
    return testServer
        .post('/register')
        .send(data)
        .expect('Content-Type', /json/)
}

describe('API Workflow', () => {
    let _server = {}
    let _testServer = {}
    let _serverUrl = ''
    beforeEach(async () => {
        const port = await getAvailablePort()
        return new Promise((resolve, reject) => {
            _server = app.listen(port, (err) => {
                if (err) return reject(err)

                const port = app.address().port
                _serverUrl = `http://localhost:${port}`
                // in the new versions
                // supertest(app) will spin up a server for you
                // and there is no need to keep track of ports.
                _testServer = supertest(_serverUrl);

                resolve()
            })
        })
    })

    afterEach(async () => {
        _server.closeAllConnections()
        await new Promise((resolve, reject) => {
            _server.close((err) => err ? reject(err) : resolve())
        })
    })


    it('should not register activity if user is not allowed', async () => {
        const request = await registerActivity(_testServer, {
            user: 'giltayar'
        })
        expect(request.statusCode).toStrictEqual(401)
        expect(request.body).toEqual({ error: 'user not allowed!' })
    })

    it('should retrive empty list of users activity as tests are isolated', async () => {
        const request = await getUsersActivity(_testServer)
        expect(request.statusCode).toStrictEqual(200)
        expect(request.body).toEqual({ users: [] })
    })

    it('should register activity and retrive list of users activity', async () => {
        const users = ['lirantal', 'tamar'].sort()
        await Promise.all(
            users
                .map(user => {
                    return registerActivity(_testServer, {
                        user
                    })
                })
        )

        const usersRequest = await getUsersActivity(_testServer)
        expect(usersRequest.statusCode).toStrictEqual(200)
        expect(usersRequest.body.users.sort()).toEqual(users)
    })
})
