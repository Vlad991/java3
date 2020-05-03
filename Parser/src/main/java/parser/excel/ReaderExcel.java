package parser.excel;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import parser.main.MainProgram;
import parser.main.MainTest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class ReaderExcel {

    private File file = new File("search.xlsx");

    public void main() {
        try {
            ReaderExcel readerExcel = new ReaderExcel();
            readerExcel.getDataExcel("Лист1");
        } catch (Exception e) {
            System.out.println("**parser.excel.ReaderExcel.parser.main() " + e);
        }
    }

    // Чтение графика
    public boolean readExcelSchedule(int day, int hour) {
        try {
            int row = hour + 1;
            int column = day; //todo

            XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(file));
            XSSFSheet sheet = workbook.getSheet("Календарь");
            String param = "";

            XSSFRow xssfRow = sheet.getRow(row);

            XSSFCell cell = xssfRow.getCell(column);

            if (cell != null) {
                param = cell.getStringCellValue();

                if (param.equals("да")) {
                    return true;
                }
            } else {
                System.out.println("**Для даного времени парсинг отключен.");
                return false;
            }
        } catch (Exception e) {
            System.out.println("Чтение графика провалено." + e);
        }
        return false;
    }

    //Чтение параметров
    public void readExcelSetting() throws IOException, Exception {
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(file));
            XSSFSheet sheet = workbook.getSheet("Setting");
            String param;
            XSSFRow row = sheet.getRow(1);

            //логин
            try {
                param = row.getCell(0).getStringCellValue();
                MainProgram.mailSenderLogin = param;
            } catch (Exception e) {
                System.out.println("**readExcelSetting()Ошибка чтения 'логин'. " + e);
            }
            // пароль
            try {
                param = row.getCell(1).getStringCellValue();
                MainProgram.mailSenderPassword = param;
            } catch (Exception e) {
                System.out.println("**readExcelSetting()Ошибка чтения 'пароль'. " + e);
            }
            // headless
            try {
                param = row.getCell(2).getStringCellValue();
                if (param.equals("да")) {
                    MainProgram.headless = true;
                }
            } catch (Exception e) {
                System.out.println("**readExcelSetting()Ошибка чтения Режима headless. " + e);
            }
            //Режим рассылки по графику
            try {
                param = row.getCell(3).getStringCellValue();
                if (param.equals("да")) {
                    MainProgram.ModeSchedule = true;
                } else {
                    MainProgram.ModeSchedule = false;
                }
            } catch (Exception e) {
                System.out.println("**readExcelSetting()Ошибка чтения Режима рассылки по графику. " + e);
            }
//            //Путь к файлу хромдрайвера
//            try {
//                parser.main.MainProgram.WayToChromedriver = row.getCell(4).getStringCellValue();
//                System.out.println("parser.main.MainProgram.WayToChromedriver: " + parser.main.MainProgram.WayToChromedriver);
//            } catch (Exception e) {
//                System.out.println("**readExcelSetting()Ошибка чтения пути хромдрайвера. " + e);
//            }

            //Максимальное количество результатов поиска
            try {
                MainProgram.maxResult = (int) row.getCell(4).getNumericCellValue();
                System.out.println("Максимальное количество результатов поиска: " + MainProgram.maxResult);
            } catch (Exception e) {
                MainProgram.maxResult = -1;
                System.out.println("**readExcelSetting()Ошибка чтения параметра maxResult. " + e);
            }

        } catch (Exception e) {
            System.out.println("readExcelSetting()Ошибка чтения Setting");
        }
    }


    //Формирование ссылки
    public void readExcel(String sheetName) throws IOException, Exception {
        XSSFWorkbook workbook = new XSSFWorkbook(new FileInputStream(file));
        XSSFSheet sheet = workbook.getSheet(sheetName);
        String text = "";
        for (int r = 1; r < sheet.getLastRowNum() + 1; r++) {//todo
            StringBuilder data = new StringBuilder();
            XSSFRow row = sheet.getRow(r);

            System.out.println("\n");
            //база
            String inquiry = "https://www.olx.ua/list/";
            //запрос
            try {
                text = row.getCell(0).getStringCellValue();
                System.out.println("text: " + text);
                inquiry += "q-" + text + "/?";
                MainProgram.subject = text;
            } catch (Exception e) {
                inquiry += "?";
                MainProgram.subject = "";
            }

            //Город
            try {
                MainProgram.city = row.getCell(1).getStringCellValue();
            } catch (Exception e) {

            }

            // только з фото
            try {
                text = row.getCell(2).getStringCellValue();
                System.out.println("text: " + text);
                if (text.equals("да")) {
                    inquiry += "search%5Bphotos%5D=1&";
                }
                System.out.println("inquary " + inquiry);
            } catch (Exception e) {

            }

            //Самые дешевые // &search%5Border%5D=filter_float_price%3Aasc
            try {
                inquiry += "search%5Border%5D=filter_float_price%3Aasc&"; //todo &
                System.out.println("inquiry " + inquiry);
            } catch (Exception e) {
                System.out.println("inquiry equals null");
            }

            // бесплатная доставка
            try {
                text = row.getCell(3).getStringCellValue();
                System.out.println("text: " + text);
                if (text.equals("да")) {
                    inquiry += "search%5Bcourier%5D=1&";
                }
                System.out.println("inquiry " + inquiry);
            } catch (Exception e) {
                System.out.println("text equals null");
            }

            // Цена от
            try {
                data.delete(0, data.length());
                data.insert(0, row.getCell(4).getNumericCellValue());
                text = data.toString();
                System.out.println("text: " + text);
                inquiry += "search%5Bfilter_float_price%3Afrom%5D=" + text + "&";
                System.out.println("inquiry " + inquiry);
            } catch (Exception e) {

            }

            // Цена до
            try {
                data.delete(0, data.length());
                data.insert(0, row.getCell(5).getNumericCellValue());
                text = data.toString();
                System.out.println("text: " + text);
                inquiry += "search%5Bfilter_float_price%3Ato%5D=" + text + "&";
                System.out.println("inquary " + inquiry);
            } catch (Exception e) {

            }

            // Получатель Логин
            try {
                MainProgram.mailReceiver = row.getCell(6).getStringCellValue();
                System.out.println("Receiver: " + MainProgram.mailReceiver);
            } catch (Exception e) {
                MainProgram.mailReceiver = "infosender878@gmail.com";
            }

            //!!!У меня есть ссылка
            try {
                text = row.getCell(7).getStringCellValue();
                if (text.indexOf("https://www.olx.ua") == 0) {
                    inquiry = text;
                }
                System.out.println("Receiver: " + MainProgram.mailReceiver);
            } catch (Exception e) {

            }
            System.out.println("Final_inquary " + inquiry);

            MainTest Parse = new MainTest();
            if (!inquiry.equals("")) { //проверка на наличие ссылки
                Parse.TestOLX(inquiry);
            }
        }
        workbook.close();
    }


    public void getDataExcel(String sheet) throws Exception {
        System.out.println(String.format("\nДанные из таблицы: %s", sheet));
        try {
            readExcel(sheet);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
