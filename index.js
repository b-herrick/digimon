const pg=require('pg');
const client=new pg.Client('postgress://localhost/digimon_db');
const morgan=require('morgan');
const cors=require('cors');
const express=require('express');
const app=express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/digimon',async(req,res,next)=>{
    try {
        const SQL=`SELECT * FROM digimon`;
        const response=await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

app.get('/api/digimon/:id',async(req,res,next)=>{
    try {
        const SQL=`SELECT * FROM digimon WHERE id=$1`;
        const response=await client.query(SQL,[req.params.id]);
        res.send(response.rows)
    } catch (error) {
        next(error);
    }
});

app.delete('/api/digimon/:id',async(req,res,next)=>{
    try {
        const SQL=`DELETE FROM digimon WHERE id=$1 RETURNING *`
        const response=await client.query(SQL,[req.params.id]);
        res.sendStatus(204)
    } catch (error) {
        next(error);
    }
});

app.post('/api/digimon',async(req,res,next)=>{
    try {
        const SQL=`INSERT INTO digimon(name,isCute) VALUES($1,$2) RETURNING *`
        const response=await client.query(SQL,[req.body.name,req.body.isCute])
        res.send(response.rows)
    } catch (error) {
        next(error);
    }
});

app.put('/api/digimon/:id',async(req,res,next)=>{
    try {
        const SQL=`UPDATE digimon SET name=$1, isCute=$2 WHERE id=$3 RETURNING *`;
        const response=await client.query(SQL,[req.body.name,req.body.isCute,req.params.id]);
        res.send(response.rows)
    } catch (error) {
        next(error);
    }
});

const setup=async ()=>{
    await client.connect();
    console.log("Connected")
    const SQL=`
    DROP TABLE IF EXISTS digimon;
    CREATE TABLE digimon(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        isCute BOOLEAN
    );
    INSERT INTO digimon (name,isCute) VALUES ('Agumon',false);
    INSERT INTO digimon (name,isCute) VALUES ('Patamon',true);
    INSERT INTO digimon (name,isCute) VALUES ('Gatomon',true);`;
    await client.query(SQL);
    const port=process.env.PORT || 3000;
    app.listen(port,()=>console.log(`On port ${port}`));
}

setup();