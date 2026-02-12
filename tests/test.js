const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testFlow() {

    let optionsChrome = new chrome.Options();
    optionsChrome.addArguments('--log-level=3');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(optionsChrome)
        .build();

    try {

        await driver.get("https://smiguelrbr.github.io/SAEP-Front/");

        // LOGIN
        await driver.wait(until.elementLocated(By.id('cpf')), 5000);

        await driver.findElement(By.id('cpf')).sendKeys('12345678901');
        await driver.findElement(By.id('password')).sendKeys('1234');

        await driver.findElement(By.className('login-btn')).click();

        // ALERT
        await driver.wait(until.alertIsPresent(), 5000);
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // IR PARA QUESTÕES
        await driver.wait(until.urlContains('questions'), 5000);

        console.log("Entrou nas questões");

        let numeroQuestao = 1;

        while (true) {

            console.log(`Respondendo questão ${numeroQuestao}`);

            // numero atual
            let numeroSpan = await driver.findElement(By.id('current-number'));
            let numeroAtual = await numeroSpan.getText();

            // esperar alternativas
            await driver.wait(until.elementLocated(By.css('.option')), 5000);

            let options = await driver.findElements(By.css('.option'));

            // clicar primeira alternativa
            await options[0].click();

            await driver.sleep(1500);

            // clicar próxima
            let nextBtn = await driver.findElement(By.id('nextBtn'));
            await nextBtn.click();

            // tentar detectar mudança
            let mudou = false;

            try {

                await driver.wait(async () => {

                    let novoNumero = await driver.findElement(By.id('current-number')).getText();
                    return novoNumero !== numeroAtual;

                }, 2000);

                mudou = true;

            } catch {

                mudou = false;

            }

            // se não mudou → última questão
            if (!mudou) {

                console.log("Última questão detectada");

                let finishBtn = await driver.findElement(By.id('finishBtn'));
                await finishBtn.click();

                break;
            }

            numeroQuestao++;

            await driver.sleep(1200);
        }

        console.log("Prova finalizada");

        await driver.sleep(5000);

    } finally {

        await driver.quit();

    }

})();
