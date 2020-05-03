package parser.main;

import parser.excel.ReaderExcel;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class MainProgram {
    public static String mailSenderLogin = "";
    public static String mailSenderPassword = "";
    public static String mailReceiver = "";
    public static Boolean headless = false;
    public static String  subject = "";
    public static String  city = "";
    public static boolean  ModeSchedule = false; // Общий переключатель режима рассылки по графику
    public static boolean  schedule = false; // Переключатель необходимости парсинга в даное времмя
    public static int  maxResult = 100; // Параметр максимального количества результатов


    //    @Test
    public void StartProgram() throws Exception{
        try {
            ReaderExcel reader = new ReaderExcel();
            reader.readExcelSetting();

            if (!ModeSchedule){
                reader.main();
            }
            if (ModeSchedule) {
                do {
                    //день недели
                    Date date = new Date();
                    Calendar c = Calendar.getInstance();
                    c.setTime(date);
                    int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
                    //сколько сейчас часов
                    SimpleDateFormat Hour = new SimpleDateFormat("HH");
                    int hour = Integer.parseInt(Hour.format(date));

//                    System.out.println(" time: " + hour);
                    System.out.println(" day of week: " + dayOfWeek);
                    System.out.println(" Сейчас =" + reader.readExcelSchedule(dayOfWeek, hour));

                    schedule = reader.readExcelSchedule(dayOfWeek, hour);
                    if (schedule) { //одноразовый цыкл
                        reader.main();
                        Date date1 = new Date();
                        SimpleDateFormat Minutes = new SimpleDateFormat("mm");
                        int minutes = Integer.parseInt(Minutes.format(date1));
                        int sleep = 60 - minutes;
                        System.out.println("sleep " + sleep + " minutes");
                        TimeUnit.MINUTES.sleep(sleep);
                    }
                    TimeUnit.SECONDS.sleep(10);
                    reader.readExcelSetting();
                } while (ModeSchedule);
            }

        } catch (Exception e){
            System.out.println("**Ошибка часового механизма");
        }
    }
}
