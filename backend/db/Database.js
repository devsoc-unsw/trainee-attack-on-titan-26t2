import pool from './connection.js';

class Database {
    /**
     * Insert a new row into a table.
     *
     * @param {string} table - Name of the table to insert into.
     * @param {Object} data - Key/value pairs where each key is a column name
     *                         and each value is what to insert into that column.
     * @returns {Promise<Object>} The newly inserted row (as returned by the database).
     *
     * @example
     * const newJob = await Database.insert('jobs', {
     *   filename: 'lecture1.mp4',
     *   status: 'pending',
     * });
     *
     * // newJob => { id: 1, filename: 'lecture1.mp4', status: 'pending', ... }
     */
    static async insert(table, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

        const query = `
            INSERT INTO ${table} (${columns.join(', ')})
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Find all rows in a table, optionally filtered by column values.
     *
     * @param {string} table - Name of the table to search.
     * @param {Object} [filters={}] - Optional key/value pairs to filter results by
     *                                 (column name -> value it must match). Leave empty
     *                                 to get every row in the table.
     * @returns {Promise<Object[]>} An array of matching rows (empty array if none found).
     *
     * @example
     * // Get every job in the table
     * const allJobs = await Database.findAll('jobs');
     *
     * @example
     * // Get only jobs with status "pending"
     * const pendingJobs = await Database.findAll('jobs', { status: 'pending' });
     */
    static async findAll(table, filters = {}) {
        const keys = Object.keys(filters);
        let query = `SELECT * FROM ${table}`;
        const values = Object.values(filters);

        if (keys.length > 0) {
            const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
            query += ` WHERE ${conditions}`;
        }

        const result = await pool.query(query, values);
        return result.rows;
    }

    /**
     * Find a single row by its id.
     *
     * @param {string} table - Name of the table to search.
     * @param {number|string} id - The id of the row to find.
     * @returns {Promise<Object|null>} The matching row, or null if no row has that id.
     *
     * @example
     * const job = await Database.findById('jobs', 3);
     * // job => { id: 3, filename: 'lecture2.mp4', status: 'processing', ... }
     * // or null if no job with id 3 exists
     */
    static async findById(table, id) {
        const query = `SELECT * FROM ${table} WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    /**
     * Find a single row by its id.
     *
     * @param {string} table - Name of the table to search.
     * @param {number|string} id - The id of the row to find.
     * @returns {Promise<Object|null>} The matching row, or null if no row has that id.
     *
     * @example
     * const job = await Database.findById('jobs', 3);
     * // job => { id: 3, filename: 'lecture2.mp4', status: 'processing', ... }
     * // or null if no job with id 3 exists
     */
    static async update(table, id, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

        const query = `
            UPDATE ${table}
            SET ${setClause}
            WHERE id = $${columns.length + 1}
            RETURNING *
        `;

        const result = await pool.query(query, [...values, id]);
        return result.rows[0] || null;
    }

    /**
     * Delete a row by its id.
     *
     * @param {string} table - Name of the table containing the row.
     * @param {number|string} id - The id of the row to delete.
     * @returns {Promise<Object|null>} The row that was deleted, or null if no row had that id.
     *
     * @example
     * const deletedJob = await Database.delete('jobs', 3);
     * // deletedJob => { id: 3, filename: 'lecture2.mp4', status: 'done', ... }
     * // or null if no job with id 3 existed
     */
    static async delete(table, id) {
        const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
}

export { Database };
