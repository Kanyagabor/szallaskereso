import express from "express";
import pool from "../utils/db.js";


const router= express.Router();


router.get("/", async(req, res) =>{
    let sql= `SELECT varosok.orszag, COUNT(DISTINCT varosok.id) AS varos_db, COUNT(szallasok.varos_id) AS szallas_db, AVG(ROUND(szallasok.ertekeles)) AS Atlag_ertkeles FROM varosok
                LEFT JOIN szallasok ON varosok.id = szallasok.varos_id
                GROUP BY varosok.orszag`;
    const [eredmeny]= await pool.query(sql);
    return res.json(eredmeny);
})

export default router