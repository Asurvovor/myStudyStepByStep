public class DivideByZero {
    public static void main(String[] args) {
        System.out.println("17.0 / 0.0 = " + (17.0 / 0.0)); // Infinity
        System.out.println("17.0 % 0.0 = " + (17.0 % 0.0)); // NaN
        System.out.println("17 / 0 = " + (17 / 0)); // RunTime Error
        System.out.println("17 % 0 = " + (17 % 0)); // RunTime Error
    }
}