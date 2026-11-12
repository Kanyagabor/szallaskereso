import express from "express";
import pool from "../utils/db.js";

const router = express.Router();

router.get("/:mennyi",async(req,res) =>{
    const top= Number(req.params.mennyi);
    let sql= `SELECT szallasok.id,szallasok.nev, varosok.nev, varosok.orszag, szallasok.csillag, szallasok.ar, 
                CASE WHEN szallasok.medence= 1 THEN "True" WHEN szallasok.medence=0 THEN "False" END AS vanemedence,
                szallasok.ertekeles
                FROM szallasok
                INNER JOIN varosok ON szallasok.varos_id = varosok.id
                ORDER BY szallasok.ertekeles DESC LIMIT ?`;
                
    const [eredmeny]= await pool.query(sql,top);
    return res.json(eredmeny);
})

export default router