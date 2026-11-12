import express from "express";
import pool from "../utils/db.js";


const router = express.Router();


router.get("/", async (req, res)=>{
    if(Object.keys(req.query).length==0){
        return res.status(400);
    }
    else{
        const varos= req.query.varos;
        const ej= Number(req.query.ej);
        const fo= Number(req.query.fo);
        if(varos&& ej&& fo){
            if(Number.isInteger(ej) && Number.isInteger(fo)){
                let sql=`SELECT 
                        szallasok.nev AS szallas, 
                        szallasok.csillag, 
                        szallasok.ar AS arFoEj, 
                        (szallasok.ar * ? * ?) AS osszesen 
                        FROM varosok
                        INNER JOIN szallasok ON varosok.id = szallasok.varos_id
                        WHERE varosok.nev = ?;`;
                const [eredmeny]= await pool.query(sql, [ej,fo,varos]);
                if(eredmeny.length==0){
                    return res.status(404);
                }
                else
                {
                    return res.json({varos: varos, ej:ej, fo:fo,ajanlatok:eredmeny});
                }
            }
            else
            {
                return res.status(400);
            }
        }
        else{return res.status(400);}
    }
})

export default router