const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


(async function testFlow() {

    let options = new chrome.Options();
    options.addArguments('--log-level=3'); // remove logs chatos

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();


    try {

        await driver.get("https://smiguelrbr.github.io/SAEP-Front/");

        await driver.wait(until.elementLocated(By.id('cpf')), 5000);

        await driver.findElement(By.id('cpf')).sendKeys('12345678901');
        await driver.findElement(By.id('password')).sendKeys('1234');

        console.log("Login preenchido");

        await driver.findElement(By.className('login-btn')).click();

        console.log("Login clicado");

        // 👇 CAPTURAR ALERT
        await driver.wait(until.alertIsPresent(), 5000);

        let alert = await driver.switchTo().alert();

        console.log("Texto do alert:", await alert.getText());

        await alert.accept(); // clicar OK

        console.log("Alert fechado");

        // esperar redirecionamento
        await driver.wait(until.urlContains('questions'), 5000);

        console.log("Redirecionou OK");

        await driver.wait(until.elementLocated(By.css('.option')), 5000);

        let option = await driver.findElement(By.css('.option'));
        await option.click();

        console.log("Selecionou alternativa");

        await driver.findElement(By.id('nextBtn')).click();

        console.log("Próxima OK");

        await driver.sleep(3000);

    } finally {
        await driver.quit();
    }

})();
