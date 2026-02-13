// const pool = require('../db');
import Pool from "../db/index.js";

export const createBook = async (req, res) => {
 const { title, author, published_year } = req.body;
 const result = await Pool.query(
 'INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *',
 [title, author, published_year]
 );
 res.status(201).json(result.rows[0]);
};

export const updateBook = async (req, res) => {
 const { id } = req.params;
 const { title, author, published_year } = req.body;
 const result = await Pool.query(
 'UPDATE books SET title=$1, author=$2, published_year=$3 WHERE id=$4 RETURNING *',
 [title, author, published_year, id]
  );
 res.json(result.rows[0]);
};

export const deleteBook = async (req, res) => {
 await Pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
 res.sendStatus(204);
};

export const getBooks = async (req, res) => {
    try {
          const result = await Pool.query('SELECT * FROM books');
          res.status(200).json(result.rows);
    } catch (error){
        res.status(500).json({"message":"Cannot fetch data." + error})
    }
};
export const getBookById = async (req, res) => {
 const { id } = req.params;
 const result = await Pool.query('SELECT * FROM books WHERE id = $1', [id]);
 res.json(result.rows[0]);
};