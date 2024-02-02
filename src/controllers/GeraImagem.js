const { Builder, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs')
const dotenv = require('dotenv');

dotenv.config()

const {IPSERVIDOR,PORTAFRONT} = process.env
const { exec } = require('child_process');

exports.REST = async (req, res) => {

    let urlBase = `http://${IPSERVIDOR}:${PORTAFRONT}/GeraImagem`;

    const {URLIMAGE, DESCBASICA, NUMEROREF, DEVALOR, PORVALOR, CODSKU, FOLDER, NOMEREV, DESCONTO, CODREVISTA} = req.body

    let urlCompleta = await `${urlBase}?urlImage=${encodeURIComponent(URLIMAGE)}&descBasica=${encodeURIComponent(DESCBASICA)}&revNom=${encodeURIComponent(NOMEREV)}` 
    urlCompleta += await `&numeroRef=${encodeURIComponent(NUMEROREF)}&deValor=${encodeURIComponent(DEVALOR)}&porValor=${encodeURIComponent(PORVALOR)}`
    //urlCompleta += await `&numeroRef=${encodeURIComponent(NUMEROREF)}&deValor=${encodeURIComponent('892,50')}&porValor=${encodeURIComponent('260,00')}`

    let caminho = `/var/www/html/GeraPromo_Pdf_Foto/imagens_promo_geradas/`
    exec(`echo super | sudo -S chmod -R 777 ${caminho}${FOLDER}/${NOMEREV}_${DESCONTO}`, (error, stdout, stderr) => {});
    let options = new chrome.Options();
        options.addArguments("--headless");
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        try {
            await driver.get(urlCompleta);
            await driver.manage().window().setRect({width: 1920, height: 1080});
            let element = await driver.findElement(By.id('promoPicImage'));
            if (!fs.existsSync(`${caminho}${FOLDER}`)){
                fs.mkdirSync(`${caminho}${FOLDER}`);
            }
            if (!fs.existsSync(`${caminho}${FOLDER}/${NOMEREV}_${DESCONTO}`)){
                fs.mkdirSync(`${caminho}${FOLDER}/${NOMEREV}_${DESCONTO}`);
            }
            await element.takeScreenshot().then(
                function(image, err) {
                    fs.writeFile(`${caminho}${FOLDER}/${NOMEREV}_${DESCONTO}/${CODSKU}_${CODREVISTA}${`${NUMEROREF}`.padStart(3, '0')}.png`, image, 'base64', function(err) {
                    	err ? console.log(err) : '';
                    });
                }
            );
        } finally {
            await driver.quit();
        }

        return res.json({response: "SUCCESSFULL"});

}
