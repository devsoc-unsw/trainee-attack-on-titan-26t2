import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: 'Backend is running' });
});

router.get('/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'Database is connected',
            serverTime: result.rows[0].now,
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({
            status: 'Database connection failed',
            error: err.message,
        });
    }
});

export default router;
