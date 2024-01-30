const db = require("../config/databasecloud");

// Rota com objetivo de consultar informações para serem colocadas na etiqueta
// Utilizando código fornecedor e produto
// Destinada a tela do sankhya de Gerar etiquetas Logistica via Excel

exports.REST = async (req, res) => {

    try {
        console.log("Consulta etiqueta Tira Teima")
        console.log(req.body)
        
        const params = req.body
       
        const result = await db.query(`
        SELECT produtos_num_fornecedor, produtos_nfabricante, REV.rev_nom, produtos_num_item, produtos_reffor, for_nom, 
          produtos_descricao, DBASICA.descbasica_nome, TAM.tam_nom, produtos_preco, produtos_pagina,
          ROUND(produtos_preco - (produtos_preco * ((WITH primeira_condicao AS (
              SELECT prodpro_porcentagem_desconto FROM erp_produtos_promocao WHERE for_cod = ${params.forcod} AND prodpro_num_produto = ${params.item}
            ),
            segunda_condicao AS (
              SELECT prodpro_porcentagem_desconto FROM erp_produtos_promocao WHERE for_cod = ${params.forcod} AND prodpro_num_produto is null
            )
            SELECT * FROM primeira_condicao
            UNION ALL
            SELECT * FROM segunda_condicao
            WHERE NOT EXISTS (SELECT 1 FROM primeira_condicao)
          )::numeric /100)),2) as desconto
        FROM erp_produtos 
        LEFT JOIN erp_desc_basica DBASICA
        ON descbasica_id = produtos_dbasica
        LEFT JOIN erp_fornecedores
	      ON for_cod = produtos_num_fornecedor
        LEFT JOIN erp_tamanho TAM
        ON tam_cod = produtos_tamanho
        LEFT JOIN erp_revistas REV
        ON REV.rev_num_rev = produtos_revista
        where produtos_num_item = ${params.item} and produtos_num_fornecedor = ${params.forcod}` );
    
        const rows = result.rows;
    
        if (rows.length === 0) {
            return res.json({ Error: "Erro: Nenhum resultado encontrado." });
        } else {
            return res.json(rows);
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};