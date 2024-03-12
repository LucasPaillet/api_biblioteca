const { getAllLibros, getLibroById, createLibro, updateLibro, deleteLibro} = require("../../src/controllers/libroController")

const libroModel = require('../../src/models/libroModel')

jest.mock('../../src/models/libroModel')

describe('Libro Controller', () =>
{
    let mockRes
    beforeEach(() =>
    {
        mockRes =
        {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    })

    test('getAllLibros retorna todos los libros', async () =>
    {
        const mockLibros =
        [
            { id: '1', titulo: 'Libro 1', autor: 'Autor 1'},
            { id: '2', titulo: 'Libro 2', autor: 'Autor 2'}
        ]

        libroModel.find.mockResolvedValue(mockLibros)

        const mockReq = {}

        await getAllLibros(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith(mockLibros)
    })

    test('getLibrobyId retorna un solo libro', async () =>
    {
        const mockLibro = { id: '1', titulo: 'Libro encontrado', autor: 'Autor encontrado'}

        libroModel.findById.mockResolvedValue(mockLibro)

        const mockReq = {params: {id: '1'}}

        await getLibroById(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith(mockLibro)
    })

    test('createLibro crea un nuevo libro', async () =>
    {
        const mockLibro = { id: '1', titulo: 'Libro nuevo', autor: 'Autor nuevo'}
        mockLibro.save = () => {}

        libroModel.create.mockResolvedValue(mockLibro)

        const mockReq = {body: mockLibro}

        await createLibro(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.json).toHaveBeenCalledWith(mockLibro)
    })

    test('updateLibro modifica un libro existente', async () =>
    {
        const libroId = '1'
        const libroActualizado = { titulo: 'Titulo actualizado', autor: 'Autor actualizado'}
        const mockLibroActualizado = {_id: libroId, ...libroActualizado}

        libroModel.findByIdAndUpdate.mockResolvedValue(mockLibroActualizado)

        const mockReq = {params: {id: "1"}, body: mockLibroActualizado}

        await updateLibro(mockReq, mockRes)

        expect(libroModel.findByIdAndUpdate).toHaveBeenCalledWith(libroId, mockLibroActualizado, {new: true})
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith(mockLibroActualizado)
    })

    test('updateLibro deberia devolver error si no existe el libro', async () =>
    {
        libroModel.findByIdAndUpdate.mockResolvedValue(null)

        const mockReq = {params: {id: "99"}, body: {titulo: 'Libro actualizado'}}

        await updateLibro(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(404)
        expect(mockRes.json).toHaveBeenCalledWith({error: 'Libro no encontrado'})
    })

    test('deleteLibro elimina un libro existente', async () =>
    {
        const mockLibroEliminado = {titulo: 'Titulo eliminado', autor: 'Autor eliminado'}

        libroModel.findByIdAndRemove.mockResolvedValue(mockLibroEliminado)

        const mockReq = {params: {id: '1'}}

        await deleteLibro(mockReq, mockRes)

        expect(libroModel.findByIdAndRemove).toHaveBeenCalledWith(mockReq.params.id)
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith(mockLibroEliminado)
    })
})