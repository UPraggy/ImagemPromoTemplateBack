const db = require("../config/databasecloud");
const dotenv = require('dotenv');

dotenv.config()

const {IPSERVIDOR,PORTASERVIDOR} = process.env



const {fetchFunc} = require('./fetchFunc.js');

exports.REST = async (req, res) => {
    try {
        console.log("\nGET CODIGO E CALL GERA IMAGEM \n")
        console.log(req.body)
        
        const {CODREVISTA, DESCONTO} = req.body
       
        const selectNomeRevista = `SELECT rev_nom FROM erp_revistas WHERE rev_num_rev = ${CODREVISTA}`

        const revistNum = await db.query(selectNomeRevista);
        const revistNome = revistNum.rows[0].rev_nom.split(" ").join("");

        URLIMAGE = revistNome+"/tmp/";

        const selectTMP = `
                SELECT
                    produtos_num_fornecedor || produtos_observacao AS SKU, 
                    produtos_descricao AS DESCBASICA, 
                    produtos_preco AS DEVALOR,
                    round(produtos_preco*((100-${DESCONTO})/100.00),2) AS PORVALOR,
                    produtos_pagina AS NUMEROREF  
                FROM ERP_PRODUTOS 
                WHERE 
                    produtos_revista = '${CODREVISTA}' 
                GROUP BY produtos_num_fornecedor, produtos_observacao, produtos_descricao, produtos_preco, produtos_pagina
                order by produtos_pagina` 
                
        const result = await db.query(selectTMP);
    
        const produtosList = result.rows;

        let data = new Date();
        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são de 0 a 11, então adicionamos 1
        let ano = data.getFullYear();

        let dataFormatada = dia + mes + ano;

        for (const val of produtosList){
            val.descbasica = val.descbasica.split("-")
            val.descbasica.pop()
            val.descbasica = val.descbasica.join(" ")
            console.log("CARREGANDO SKU "+val.sku)
            await fetchFunc.fetchPost(`http://${IPSERVIDOR}:${PORTASERVIDOR}/GeraImagem`, {URLIMAGE: URLIMAGE+val.sku+".jpg", 
            DESCBASICA: val.descbasica, 
            NUMEROREF: val.numeroref, 
            DEVALOR: val.devalor, 
            PORVALOR: val.porvalor,
            CODSKU: val.sku,
            FOLDER: dataFormatada,
            NOMEREV: revistNome,
            DESCONTO: DESCONTO,
            CODREVISTA: CODREVISTA
        })
            .then(console.log("SUCESSO SKU "+val.sku))
        }

        return res.json({MESSAGE: "SUCCESSFULL"});
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};



