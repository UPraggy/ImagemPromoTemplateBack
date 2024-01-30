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
        console.log("\n\nUpdate ControleRev _ Pedidos")
        console.log(req.body)

        const {CODPARC, PEDIDO, IPEDIDO} = req.body
        
        const selectTMP = `
            UPDATE 
                PEDIDOS

                SET
                    DATA_NEGOC = '${PEDIDO.data_negoc}', 
                    ${PEDIDO.data_encerr ? `DATA_ENCERR = '${PEDIDO.data_encerr}',` : ''}
                    NOMECLIE = '${PEDIDO.nomeclie}',  
                    TOTALITENS = ${PEDIDO.totalitens},  
                    TOTALGERAL = ${desconverterFloat(PEDIDO.totalgeral)},  
                    ${PEDIDO.observacao ? `OBSERVACAO = '${PEDIDO.observacao}',` : `OBSERVACAO = '',`}
                    STATUS = '${PEDIDO.status}'
                WHERE
                    CPFCNPJ_PARC = '${decriptaDado(CODPARC).toString(CryptoJS.enc.Utf8)}'
                    AND DOCUMENTO = ${PEDIDO.documento}`
        const result = await db.query(selectTMP)

        if (IPEDIDO){

        }
                    
        const rows = result.rows;
        if (rows.length === 0) {
            return res.json({ Error: "Nenhum Pedido Encontrado, para este periodo." });
        } else {
            return res.json(rows);
        }
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};