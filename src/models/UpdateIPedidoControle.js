const db = require("../config/databaserevendedora");
const CryptoJS = require('crypto-js');

// Rota com objetivo de Realizar login do usuário e retornar as informações
function decriptaDado(dado){
    return CryptoJS.AES.decrypt(dado, 'T_cB@b0918Revend')
}

function desconverterFloat (valor) {
    var valorSemFormatacao = valor.replace('.', '').replace(',', '.');
    return parseFloat(valorSemFormatacao);
  }

exports.REST = async (req, res) => {

    try {
        console.log("\n\nUpdate IPedido ControleRev")
        console.log(req.body)

        const {DOCUMENTO, ITENS, CODPARC} = req.body

        
        
        const deleteIpedidos = `
                DELETE 
                    FROM IPEDIDOS
                WHERE 
                    CPFCNPJ_PARC = '${decriptaDado(CODPARC).toString(CryptoJS.enc.Utf8)}'
                    AND DOCUMENTO = ${DOCUMENTO}`
                

        const result = await db.query(deleteIpedidos)

        let insertTMP = ''
        ITENS.forEach((val, i) => {
            insertTMP += `
            INSERT INTO
            IPEDIDOS
            (
                DOCUMENTO,
                CPFCNPJ_PARC,
                FOR_COD,
                ITEM_COD,
                FOR_NOM,
                DESCBAS,
                TAM_NOM,
                QUANTIDADE,
                VALOR
            ) 
            VALUES
            (
                ${DOCUMENTO}, 
                '${decriptaDado(CODPARC).toString(CryptoJS.enc.Utf8)}', 
                ${val.for_cod}, 
                ${val.item_cod},
                '${val.for_nom}', 
                '${val.descbas}',
                '${val.tam_nom}',
                ${val.quantidade},
                ${desconverterFloat(val.valor)}
                );`
        });
        
        const resultInsert = await db.query(insertTMP)
                    
        const rowsInsert = resultInsert;

        console.log(rowsInsert)
        if (rowsInsert === 0) {
            return res.json({ Error: "Nenhum Item Inserido." });
        } else {
            return res.json('');
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};