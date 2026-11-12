import express from "express";
import pool from "../utils/db.js";


const router= express.Router();


router.get("/", async (req,res)=>{
    let sql= `SELECT szallasok.id, varosok.nev,varosok.orszag, szallasok.nev,szallasok.csillag,szallasok.ar, CASE WHEN szallasok.medence= 1 THEN 'True' WHEN szallasok.medence= 0 THEN 'False' END AS van_e_medence,
                szallasok.ertekeles FROM szallasok 
                INNER JOIN varosok ON szallasok.varos_id= varosok.id WHERE 1`;
    if(Object.keys(req.query).length== 0){
        sql+=` ORDER BY szallasok.ar DESC`;
        const[eredmeny]= await pool.query(sql);
        return res.json(eredmeny);
    }
    else{
        const varos= req.query.varos;
        const mincsillag= req.query.mincsillag;
        const maxar= req.query.maxar;
        const medence= req.query.medence;
        let lekerdezes=[];

        if(varos){
            sql+= ` AND varosok.nev=?`;
            lekerdezes.push(varos);
        }
        if(mincsillag){
            if(mincsillag<=5)
            {   
            sql+= ` AND szallasok.csillag>= ?`;
            lekerdezes.push(mincsillag);
            }
            else{
                return res.status(400);
            }
        }
        if(maxar){
            sql+= ` AND szallasok.ar <= ?`;
            lekerdezes.push(maxar);
        }
        if(medence){
            if(medence="igen"){
                const medenceint= 1;
                sql+= ` AND szallasok.medence =?`;
                lekerdezes.push(medenceint);
            }
            if(medence="nem"){
                const medenceint = 0;
                sql+= ` AND szallasok.medence=?`;
                lekerdezes.push(medenceint);
            }
        }
        sql+= ` ORDER BY szallasok.ar DESC`;
        const [eredmeny]= await pool.query(sql, [lekerdezes]);
        return res.json(eredmeny);
    }
})

router.get("/:id", async (req,res)=>{
    const id= Number(req.params.id);
    if(Number.isInteger(id)){
        let sql= `SELECT szallasok.id, varosok.nev,varosok.orszag, szallasok.nev,szallasok.csillag,szallasok.ar, 
                    CASE WHEN szallasok.medence= 1 THEN 'True' WHEN szallasok.medence= 0 THEN 'False' END AS van_e_medence,
                    szallasok.ertekeles FROM szallasok 
                    INNER JOIN varosok ON szallasok.varos_id= varosok.id WHERE szallasok.id= ?`;
        const [eredmeny]= await pool.query(sql, id);
        if (eredmeny.length== 0){
            return res.status(404);
        }
        else{return res.json(eredmeny);}
    }
})

export default router