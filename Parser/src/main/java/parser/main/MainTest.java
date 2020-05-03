package parser.main;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import parser.mail.CrunchifyJavaMailExample;

import javax.mail.MessagingException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class MainTest {
    private static WebDriver driver;
    private static String out = "";
    private ArrayList tabs2 = null;
    private String xpath = "//*[@id='offers_table']/tbody/tr/td/div/table/tbody/tr/td/a"; // Xpath на обявления
    List<WebElement> empty = new ArrayList<WebElement>(); // лист для обнуления

    //    @Test
    public void TestOLX(String inquiry) throws Exception {

        try { // big try

//        try { //открытие страницы
            out = "";

            System.setProperty("webdriver.chrome.driver", "/Users/mojnovyjmak/Desktop/Parser/chromedriver");
//            System.setProperty("webdriver.chrome.driver", "/Users/kuzmavladislavvladimirovic/Documents/2019/java3/Parser/src/main/resources/chromedriver");

            // запуск хрома
//            try {
            if (MainProgram.headless) {
                ChromeOptions options = new ChromeOptions();
                options.addArguments("headless");
                driver = new ChromeDriver(options);
            } else {
                driver = new ChromeDriver();
            }
//            } catch (Exception e){
//            System.out.println("**ChromeDriver didn't opened");
//            }
            //Открытие ссылки
//        driver = new FirefoxDriver();
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
            driver.get(inquiry);


//        } catch (Exception e) {
//            System.out.println("**Error SetupDriver");
////            break;
//        }


            // Переменные
            int resultLinksLength = 0;
            List<WebElement> resultLinks = null;

            // Закрываем подсказку 1
            try {
                WebElement element = driver
                        .findElement(By.xpath("//*[@id='paramsListOpt']/div/div[3]/label[1]"));
                JavascriptExecutor executor = (JavascriptExecutor) driver;
                executor.executeScript("arguments[0].click();", element);
                System.out.println("***Закрыта подсказка1");
            } catch (Exception e) {
                System.out.println("**НеЗакрыта подсказка1**Произошло какое-то исключение in: " + e.toString());
                e.printStackTrace();
            }

            // Добавление Города
            try {
                if (!MainProgram.city.equals("")) {
                    System.out.println("Point 1");
                    WebElement cityField = driver.findElement(By.xpath(".//*[@id='cityField']"));
                    System.out.println("Point 2");
                    cityField.sendKeys(MainProgram.city);
                    System.out.println("Point 3");

//                    driver.findElement(By.xpath(".//*[@id='submit-searchmain']")).click();

//                    WebElement ButtonFind = driver.findElement(By.xpath(".//*[@id='submit-searchmain']"));
                    WebElement ButtonFind = driver.findElement(By.xpath("//*[@id='autosuggest-geo-ul']/li[1]/a"));
                    Actions actions = new Actions(driver);
                    actions.moveToElement(ButtonFind).click().perform();
                    System.out.println("Point 4");
                }
            } catch (Exception e) {
                System.out.println("Ошибка при вводе в поле города. " + e);
            }

            // Закрываем подсказку 2
            try {
                driver.findElement(By.xpath("//*[@id='cookiesBar']/button")).click();
                System.out.println("***Закрыта подсказка2");
            } catch (Exception e) {
                System.out.println("**НеЗакрыта подсказка2**Произошло какое-то исключение in: " + e.toString());
                e.printStackTrace();
            }

            List<WebElement> Nextsheet = empty;
            int countResult = 0;
            do {
                if (countResult >= MainProgram.maxResult) {
                    break;
                }
                //проверка наличия обявлений
                try {
                    System.out.println("буду искать вариант без обявлений");
                    resultLinks = driver.findElements(By.xpath("//*[@id='body-container']/div[2]/div/div[2]/p/span [@class='marker']"));
                    if (resultLinks.size() == 0) { // если нашел обявления
                        resultLinks = driver.findElements(By.xpath(xpath));
                        resultLinksLength = resultLinks.size(); // узнаем, сколько всего элементов на 1 странице
                        System.out.println("resultLinksLength: " + resultLinksLength);
                    } else { // если нету обявлений
                        resultLinksLength = 0;
                        System.out.println("resultLink" + resultLinks);
                    }
                } catch (Exception e) {
                    System.out.println("** Ошибка поиска обявлений");
                }

                for (int i = 0; i <= resultLinksLength - 1; i++) { // Перебираем обявления
                    if (countResult >= MainProgram.maxResult) {
                        break;
                    }
                    countResult++;

                    //Открываем обявления в новой вкладке
                    try {
                        new WebDriverWait(driver, 10).until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
                        String selectLinkOpeninNewTab = Keys.chord(Keys.COMMAND, Keys.RETURN);
//                        resultLinks = driver.findElements(By.xpath(xpath));
                        resultLinks.get(i).sendKeys(selectLinkOpeninNewTab);
                        // Переключение на вторую вкладку
                        tabs2 = new ArrayList(driver.getWindowHandles());//Получение списка табов
                        int last = driver.getWindowHandles().size() - 1;
                        driver.switchTo().window(tabs2.get(last).toString());//Переключение на второй таб в браузере
                    } catch (Exception e) {
                        System.out.println("**Сылка не открыта");
                        e.printStackTrace();
                    }

                    // Копируем информацию

                    //Цена
                    try {
                        String price = driver.findElement(By.xpath(".//*[@id='offeractions']/div[1]")).getText();
                        price = price.replace("\n", " ");
                        System.out.println("price: " + price);
                        out += "<h2>Цена: " + price + "</h2>";
                    } catch (Exception e) {
                        out += "<h2>Цена: -</h2>";
                        System.out.println("**Нету цены");
                    }

                    //Название
                    try {
                        String title = driver.findElement(By.xpath(".//*[@id='offerdescription']//h1")).getText();
                        System.out.println("title: " + title);
                        out += "<h2>Название: " + title + "</h2>";
                    } catch (Exception e) {
                        out += "<h2>Название: -</h2>";
                        System.out.println("**Нету названия");
                    }

                    //Город
                    try {
                        String adres = driver.findElement(By.xpath(".//*[@id='offeractions']//address/p")).getText();
                        System.out.println("adres: " + adres);
                        out += "<h3>Город:" + adres + "</h3>";
                    } catch (Exception e) {
                        out += "<h3>Город: -</h3>";
                        System.out.println("**Нету города");
                    }

                    //Телефон
                    try {
                        String show = "//*[@id='contact_methods']/li[2]/div/span";
                        String showOff = "//*[@id='contact_methods']/li[2]/div/span[@style='display: none;']";
                        String listPhone = "//*[@id='contact_methods']/li[2]/div/strong";

                        // клик по кнопке "показати"
                        new WebDriverWait(driver, 2).until(ExpectedConditions.presenceOfElementLocated(By.xpath(show)));
                        WebElement ButtonShow = driver.findElement(By.xpath(show));
//                    IJavaScriptExecutor ex = (IJavaScriptExecutor)Driver;
//                    ex.ExecuteScript("arguments[0].click();", elementToClick);

//                    ButtonShow.click();

                        Actions actions = new Actions(driver);
                        actions.moveToElement(ButtonShow).click().perform();

                        // копирование номера
                        new WebDriverWait(driver, 2).until(ExpectedConditions.presenceOfElementLocated(By.xpath(showOff))); //проверка показался ли номер
                        List<WebElement> listphones = null;
                        try {
                            listphones = driver.findElements(By.xpath(listPhone));
                        } catch (Exception e) {
                            System.out.println("Phone eror: " + e.toString());
                        }
                        String phones = "";
                        phones = (phones + listphones.get(0).getText()/*.toString()*/);
                        phones = phones.replace("\n", ", ");
                        out += "Телефон: " + phones + "<br/>";
                        System.out.println("phones: " + phones);
                    } catch (Exception e) {
                        out += "Телефон: -<br/>";
                        System.out.println("**Нету телефона. " + e.toString());
                    }

                    // Ссылка для сообщения
                    try {
                        String link = "нету ссылки для сообщения";
                        link = driver.findElement(By.xpath(".//*[@id='contact_methods']/li[1]/a")).getAttribute("href");
                        System.out.println("link: " + link);
                        out += "Ссылка для сообщения: " + link + "<br/>";
                    } catch (Exception e) {
                        out += "Ссылка для сообщения: -<br/>";
                        System.out.println("**Нету ссылки для сообщения");
                    }

                    // Имя
                    try {
                        String name = driver.findElement(By.xpath(".//*[@id='offeractions']//div[2]/h4")).getText();
                        System.out.println("name: " + name);
                        out += "Имя: " + name + "<br/>";
                    } catch (Exception e) {
                        out += "Имя: -<br/>";
                        System.out.println("**Нету имени");
                    }

                    //URL
                    try {
                        String url = driver.getCurrentUrl();
                        System.out.println("URL: " + url);
                        out += "Ссылка на обявление: " + url + "<br/>";
                    } catch (Exception e) {
                        out += "Ссылка на обявление: -<br/>";
                        System.out.println("**Нету URL");
                    }

                    //количество обявлений автора
                    try {
                        String quantity = "" + quantity();
                        System.out.println("quantity: " + quantity);
                        out += "Количество обявлений автора: " + quantity + "<br/>";
                    } catch (Exception e) {
                        out += "Количество обявлений автора: -<br/>";
                        System.out.println("**Я думаю Нету обявлений");
                    }

                    //enter и возвращение на первую вкладку
                    try {
                        System.out.println("\n");
                        driver.close();
                        driver.switchTo().window(tabs2.get(0).toString());//Переключение на первый таб в браузере
                    } catch (Exception e) {
                        System.out.println("**Не могу переключится на первый таб");
                    }
                }
                Nextsheet = empty;
                Nextsheet = driver.findElements(By.xpath(".//*[@id='body-container']//div/div[4]/span[last()]/a/span"));
                try {
                    Nextsheet.get(0).click();
                } catch (Exception e) {
                    System.out.println("нету кнопки 'следующий' в общем списке");
                }
            } while (Nextsheet.size() > 0);
        } catch (Exception e) {
            System.out.println("**Site is not supported");
        }
        driver.quit();
        SendResult();
    }

    //    @After
    public void SendResult() throws MessagingException {
        CrunchifyJavaMailExample Send = new CrunchifyJavaMailExample();
        if (out != "") {
            Send.main(out);
            //        Send.parser.main("<h2>price: 150 грн. Договорная</h2><br /><h2>title: Продам Nokia 1680c-2</h2><br /><h3>adres: Киев, Киевская область, Оболонский</h3><br />phones: 066 980 0607<br />link: https://www.olx.ua/obyavlenie/contact/prodam-nokia-1680c-2-IDpnAUa.html?bs=adpage_chat_login_top&amp;search_id=0f93ab9226#0f93ab9226<br />name: Євгеній<br />URL: https://www.olx.ua/obyavlenie/prodam-nokia-1680c-2-IDpnAUa.html#0f93ab9226<h2>price: 150 грн. Договорная</h2><br /><h2>title: Продам Nokia 1680c-2</h2><br /><h3>adres: Киев, Киевская область, Оболонский</h3><br />phones: 066 980 0607<br />link: https://www.olx.ua/obyavlenie/contact/prodam-nokia-1680c-2-IDpnAUa.html?bs=adpage_chat_login_top&amp;search_id=0f93ab9226#0f93ab9226<br />name: Євгеній<br />URL: https://www.olx.ua/obyavlenie/prodam-nokia-1680c-2-IDpnAUa.html#0f93ab9226");
        } else {
            System.out.println("Нету результатов поиска");
        }
    }

    public int quantity() {
        // Получение количества обявлений автора
        int quantity = 0; // щетчик обявлений
        try {
//                String buttonname = "//*[@id='offeractions']//div[2]/h4/a";
            String buttonname = "//a [@class='user-offers']";
//                String buttonname = "//*[@id='offeractions']/div[3]/div[2]/a";
//                String buttonname = ".//*[@id='offeractions']/div[4]/div[2]/a";
//                String buttonname = "//*[@id=\"offeractions\"]/div[3]/div[2]/a";
            WebElement buttonName = driver.findElement(By.xpath(buttonname));
            Actions actions = new Actions(driver);
            actions.moveToElement(buttonName).click().perform();

//                driver.findElement(By.xpath(buttonName)).click();

//                String selectLinkOpeninNewTab = Keys.chord(Keys.CONTROL, Keys.RETURN);
//                driver.findElement(By.xpath(buttonName)).sendKeys(selectLinkOpeninNewTab); //Переход в меню автора
//                tabs2 = new ArrayList(driver.getWindowHandles());//Получение списка табов
//                driver.switchTo().window(tabs2.get(1).toString());//Переключение на второй таб в браузере (активация вкладки меню автора)

            //два варианта
            List<WebElement> obyavleniaAvtora; // лист для обявлений автора
            List<WebElement> ButtonNextPage = null;
            String ListUser = xpath;
            String ListBusiness = "//*[@id='listContainer']/table[2]/tbody//tr[1]/td[1]/a";
            String NextUser = "//*[@id='body-container']//div/div[5]/span[last()]/a/span";
            String NextBusiness = "//*[@id='listContainer']/div/span[last()]/a/span";

            //вариант1,2 - Часное лицо
            try {
                //условия запуска
                obyavleniaAvtora = driver.findElements(By.xpath(ListUser));
//                obyavleniaAvtora.addAll(driver.findElements(By.xpath(ListBusiness)));
//                    System.out.println("Часное лицо");
                do {
                    quantity += obyavleniaAvtora.size(); //сумирование
                    //работа с кнопкой
                    ButtonNextPage = empty;
                    ButtonNextPage = driver.findElements(By.xpath(NextUser));
//                    ButtonNextPage.addAll(driver.findElements(By.xpath(NextBusiness)));
                    try {
                        ButtonNextPage.get(0).click();
                    } catch (Exception e) {
                        System.out.println("нету кнопки 'следующий'");
                    }
                } while (ButtonNextPage.size() > 0);
            } catch (Exception e) {
                System.out.println("Ошибка: " + e.toString());
            }
//
//                try {
//                    obyavleniaAvtora = driver.findElements(By.xpath(ListBusiness));
//                    System.out.println("Бизнес лицо");
//                } catch (Exception e){
//                    System.out.println("Не Бизнес лицо");
//
//                }
//                do {
//                    if (ButtonNextPage1 != null){ ButtonNextPage1.get(0).click(); }
//                    if (driver.findElements(By.xpath(ListUser)).size()>0) {
//                        System.out.println("Часное лицо");
//                        obyavleniaAvtora = driver.findElements(By.xpath(xpath)); // поиск обявлений
//                        quantity += obyavleniaAvtora.size(); //сумирование
//                        System.out.println("quantity: " + quantity);
////                        new WebDriverWait(driver, 10).until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
//                        try { ButtonNextPage1 = driver.findElements(By.xpath("//*[@id='body-container']//div/div[4]/span[last()]/a/span"));} catch (Exception e){
//                            System.out.println("Кнопка следующий найдена в часном");
//                        }
//                        System.out.println("ButtonNextPage1:" + ButtonNextPage1);
//                    }
//                } while (ButtonNextPage1.size()>0);

            //вариант2 - Бизнес
//                List<WebElement> ButtonNextPage2 = null;
//                do {
//                    if (ButtonNextPage2 != null){ ButtonNextPage2.get(0).click(); }
//                    System.out.println("point 1");
//                    String ListBusiness = "//*[@id='listContainer']/table[2]/tbody//tr[1]/td[1]/a";
//                    System.out.println("point 2");
//                    if (driver.findElements(By.xpath(ListBusiness)).size()>0) {
//                        System.out.println("Бизнес");
//                        obyavleniaAvtora = driver.findElements(By.xpath(ListBusiness)); // поиск обявлений
//                        quantity += obyavleniaAvtora.size(); //сумирование
//                        try { ButtonNextPage2 = driver.findElements(By.xpath("//*[@id='listContainer']/div/span[last()]/a/span"));} catch (Exception e){
//                            System.out.println("Кнопка следующий найдена в бизнес");
//                        }
//                        System.out.println("ButtonNextPage" + ButtonNextPage2);
//                    }
//                } while (ButtonNextPage2.size()>0);

        } catch (Exception e) {
            quantity = 1;
            System.out.println("**У автора одно обявление" + e);
        }
        return quantity;
    }
}
