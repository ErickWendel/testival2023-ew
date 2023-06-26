import { describe, it, beforeEach, afterEach } from 'node:test'
import { deepStrictEqual, strictEqual } from 'node:assert'
import { app } from '../index.js'

async function getUsersActivity(serverUrl) {
    return fetch(`${serverUrl}/register`, {
        method: 'GET',
    })
}
async function registerActivity(serverUrl, data) {
    return fetch(`${serverUrl}/register`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

describe('API Workflow', () => {
    let _serverUrl = ''
    let _server = {}

    beforeEach(async () => {
        return new Promise((resolve, reject) => {
            _server = app.listen(0, (err) => {
                if (err) return reject(err)

                const port = app.address().port
                _serverUrl = `http://localhost:${port}`

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
        const request = await registerActivity(_serverUrl, {
            user: 'giltayar'
        })
        strictEqual(request.status, 401)
        const response = await request.json()
        deepStrictEqual(response, { error: 'user not allowed!' })
    })

    it('should retrive empty list of users activity as tests are isolated', async () => {
        const request = await getUsersActivity(_serverUrl)
        strictEqual(request.status, 200)
        const response = await request.json()
        deepStrictEqual(response, { users: [] })
    })

    it('should register activity and retrive list of users activity', async () => {
        const users = ['lirantal', 'tamar'].sort()
        await Promise.all(
            users
                .map(user => {
                    return registerActivity(_serverUrl, {
                        user
                    })
                })
        )

        const usersRequest = await getUsersActivity(_serverUrl)
        strictEqual(usersRequest.status, 200)
        const response = await usersRequest.json()
        deepStrictEqual(response.users.sort(), users)
    })
})
