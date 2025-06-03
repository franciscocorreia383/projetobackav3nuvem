//import express from 'express';
const express = require('express');

//import createClient from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
//import {createClient} from '@supabase/supabase-js'
const supabaseClient = require('@supabase/supabase-js');

//import morgan from 'morgan';
const morgan = require('morgan');

//import bodyParser from "body-parser";
const bodyParser = require('body-parser');

require('dotenv').config();

//import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const app = express();

const cors=require("cors");""
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const supabase = 
    supabaseClient.createClient(process.env.API_URL,process.env.API_KEY)

app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
    
    console.log(`lists all products${data}`);
    
    return res.send(data);

});

app.get('/products/:id', async (req, res) => {
    console.log("id = " + req.params.id);
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id)

    console.log("retorno "+ data);

    return res.send(data);
});

app.post('/products', async (req, res) => {
    const { name, description, price } = req.body;

    const { error } = await supabase
        .from('products')
        .insert({ name, description, price });

    if (error) {
        return res.status(400).send(error); // <- importante!
    }

    console.log("retorno", name, description, price);

    return res.send("created!!");
});

app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    return res.send("updated!!");
});

app.delete('/products/:id', async (req, res) => {
    try {
        console.log("delete: " + req.params.id);

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) {
            console.error("Erro ao deletar:", error);
            return res.status(400).json({ error: error.message });
        }

        console.log("Produto deletado com id:", req.params.id);
        return res.status(200).send("deleted!!");
    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


app.get('/', (req, res) => {
    return res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    return res.send("Hello again I am working my friend to the moon and behind <3");
});

app.listen(3000, () => {
    return console.log(`> Ready on http://localhost:3000`);
});