import express from "express";
import pool from "../utils/db.js";


const router= express.Router();


router.get("/",async (req,res)=>{
        let sql = `SELECT varosok.id, varosok.nev,varosok.orszag, COUNT(szallasok.id) AS szallas_db, MIN(szallasok.ar) AS legolcsobb FROM varosok
                     INNER JOIN szallasok ON varosok.id= szallasok.varos_id
                     GROUP BY varosok.nev
                     HAVING 1`;
        if(Object.keys(req.query).length==0){
            sql+= ` ORDER BY varosok.nev ASC, AVG(ROUND(szallasok.ertekeles))`;
            const [eredmeny]= await pool.query(sql);
            return res.json(eredmeny);
        }
        else{
            const minszallas= req.query.minszallas;

            const lekerdezes=[];
            if(minszallas){
                sql+= ` AND szallas_db >= ?`;
                lekerdezes.push(minszallas);
            }
            const [eredmeny]= await pool.query(sql, [lekerdezes]);
            return res.json(eredmeny);
        }
})

router.get("/:id/szallasok",async (req,res)=>{
    const id= Number(req.params.id);
    if(Number.isInteger(id)){
        let sql=`SELECT varosok.id, varosok.nev,varosok.orszag, COUNT(szallasok.id) AS szallas_db, MIN(szallasok.ar) AS legolcsobb FROM varosok
                     INNER JOIN szallasok ON varosok.id= szallasok.varos_id
                     GROUP BY varosok.nev
                     HAVING varosok.id= ?`;
        const [eredmeny]= await pool.query(sql,id);
        if(eredmeny.length== 0){
            return res.json([]);
        }
        else{
            return res.status(404);
        }
    }
})


export default router