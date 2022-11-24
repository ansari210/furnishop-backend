import { Router } from "express";

const router = Router();

/**
name 
review
email
rating
 */

// GET
router.get('/', (req, res) => {
    try {
        const { name, review, email, rating } = req.body
        res.status(200).json(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
})
// GET BY ID
router.get('/:id', (req, res) => {
    try {
        const { name, review, email, rating, id } = req.body
        res.status(200).json(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
})
// POST
router.post('/', (req, res) => {
    try {
        const { name, review, email, rating } = req.body
    } catch (error) {
        res.send(error)
    }
})
// UPDATE
router.patch('/', (req, res) => {
    try {
        const { name, review, email, rating } = req.body
    } catch (error) {
        res.status(500).send(error);
    }
})
// DELETE
router.delete('/', (req, res) => {
    try {
        const { name, review, email, rating } = req.body
    } catch (error) {
        res.status(500).send(error);
    }
})

export default router