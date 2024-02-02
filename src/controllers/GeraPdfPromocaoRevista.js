const fs = require('fs')
const { exec, spawn } = require('child_process');

exports.REST = async (req, res) => {
    try {
        console.log("\nGERA PDF PROMOCAO \n")

        let caminho = await `/var/www/html/GeraPromo_Pdf_Foto/imagens_promo_geradas/GeraPdf/`;

        //PERMISSÃO DE PASTA PARA APAGAR E CRIAR ARQUIVOS
        exec(`echo super | sudo -S chmod -R 777 ${caminho}`, (error, stdout, stderr) => {});
        
        let data = new Date();
        let dia = String(data.getDate()).padStart(2, '0');
        let mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são de 0 a 11, então adicionamos 1
        let ano = data.getFullYear();

        let dataFormatada = dia + mes + ano;

		let nomeArquivo = await `PDF_PROMOCAO_${dataFormatada}.pdf`;
		const pythonProcess = await spawn('python3',['/var/www/html/GeraPromo_Pdf_Foto/backGeraImagemPromo/src/controllers/imageinpdf.py', caminho, nomeArquivo]);
		
		await pythonProcess.stdout.on('data', (data) => {
    		// Faça algo com os dados retornados do script python
    		console.log(data.toString());
		});
    
        pythonProcess.on('close', (code) => {
        		return res.json({MESSAGE: "SUCCESSFULL"});
		});
    }

    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ Error: error.message });
    }  
};



