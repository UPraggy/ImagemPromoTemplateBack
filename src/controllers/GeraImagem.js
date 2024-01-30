/*const { Builder, By, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');*/
const fs = require('fs')
const dotenv = require('dotenv');

dotenv.config()

const {IPSERVIDOR,PORTAFRONT} = process.env

exports.REST = async (req, res) => {

    let urlBase = `http://${IPSERVIDOR}:${PORTAFRONT}/GeraImagem`;

    const {URLIMAGE, DESCBASICA, NUMEROREF, DEVALOR, PORVALOR, CODSKU, FOLDER, NOMEREV} = req.body

    let urlCompleta = await `${urlBase}?urlImage=${encodeURIComponent(URLIMAGE)}&descBasica=${encodeURIComponent(DESCBASICA)}&revNom=${encodeURIComponent(NOMEREV)}` 
    urlCompleta += await `&numeroRef=${encodeURIComponent(NUMEROREF)}&deValor=${encodeURIComponent(DEVALOR)}&porValor=${encodeURIComponent(PORVALOR)}`
    //urlCompleta += await `&numeroRef=${encodeURIComponent(NUMEROREF)}&deValor=${encodeURIComponent('892,50')}&porValor=${encodeURIComponent('260,00')}`

    /*let options = new chrome.Options();
        options.addArguments("--headless");
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        try {
            await driver.get(urlCompleta);
            await driver.manage().window().setRect({width: 1920, height: 1080});
            let element = await driver.findElement(By.id('promoPicImage'));
            if (!fs.existsSync(`\\\\192.168.0.252/Arquivos/u/publico/marketing/SKU/IMAGEMPROMOCOES/${FOLDER}`)){
                fs.mkdirSync(`\\\\192.168.0.252/Arquivos/u/publico/marketing/SKU/IMAGEMPROMOCOES/${FOLDER}`);
            }
            if (!fs.existsSync(`\\\\192.168.0.252/Arquivos/u/publico/marketing/SKU/IMAGEMPROMOCOES/${FOLDER}/${NOMEREV}`)){
                fs.mkdirSync(`\\\\192.168.0.252/Arquivos/u/publico/marketing/SKU/IMAGEMPROMOCOES/${FOLDER}/${NOMEREV}`);
            }
            await element.takeScreenshot().then(
                function(image, err) {
                    fs.writeFile(`\\\\192.168.0.252/Arquivos/u/publico/marketing/SKU/IMAGEMPROMOCOES/${FOLDER}/${NOMEREV}/${CODSKU}.png`, image, 'base64', function(err) {
                        console.log(err);
                    });
                }
            );
        } finally {
            await driver.quit();
        }*/

        return res.json({response: "SUCCESSFULL"});

}