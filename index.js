import { once } from 'node:events'
import { createServer } from 'node:http'
const loggedUsers = []
const allowedUsers = [
    'erickwendel',
    'tamar',
    'lirantal',
]

async function registerUserActivity(request, response) {
    const { user } = JSON.parse(await once(request, 'data'))
    if (!allowedUsers.includes(user)) {
        response.writeHead(401, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({
            error: 'user not allowed!'
        }))
        return
    }

    loggedUsers.push(user)
    return response.end(JSON.stringify({ result: 'ok' }))
}

async function getUsersActivity(request, response) {
    return response.end(JSON.stringify({ users: loggedUsers }))
}

async function handler(request, response) {
    if (request.url === '/register' && request.method === 'POST') {
        response.writeHead(201, { 'Content-Type': 'application/json' })
        return registerUserActivity(request, response)
    }

    if (request.url === '/register' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        return getUsersActivity(request, response)
    }

    response.writeHead(404)
    response.end({ error: 'route not found' })
}

const app = createServer(handler)
app.on('listening', () => {
    console.log(`server listening at ${app.address().port}`)
})

if (process.env.NODE_ENV !== 'test') {
    app.listen(3000)
}

export { app }
