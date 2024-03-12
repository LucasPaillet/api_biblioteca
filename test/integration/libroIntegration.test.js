const request = require('supertest')
const app = require('../../src/app')
const libroModel = require('../../src/models/libroModel')

jest.mock('express-oauth2-jwt-bearer', () =>
{
    return {
        auth: jest.fn().mockImplementation(() => (req, res, next) => next()),
        requiredScopes: jest.fn().mockImplementation(() => (req, res, next) => next())
    }
})

jest.mock('../../src/models/libroModel')

describe('Libro API', () =>
{
    test('GET /libros obtiene todos los libros', async () =>
    {
        const mockLibros = 
        [
            {id: '1', titulo: 'Libro 1'},
            {id: '2', titulo: 'Libro 2'},
        ]

        libroModel.find.mockResolvedValue(mockLibros)
        const response = await request(app).get('/api/libros')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockLibros)
        expect(libroModel.find).toHaveBeenCalledTimes(1)
    })

    test('POST /libros deberia crear un nuevo libro', async () =>
    {
        const libroCreado = {id: '1', titulo: 'Nuevo libro', autor: 'Nuevo autor'}
        const mockLibroCreado = {...libroCreado, save:() => {}}

        libroModel.create.mockResolvedValue(mockLibroCreado)
        const response = await request(app).post('/api/libros').send(mockLibroCreado)

        expect(response.status).toBe(201)
        expect(response.body).toEqual(libroCreado)
        expect(libroModel.create).toHaveBeenCalledWith(libroCreado)
        expect(libroModel.create).toHaveBeenCalledTimes(1)
    })
})