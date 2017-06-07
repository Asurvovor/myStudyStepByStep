/* 笛卡尔坐标转极坐标
 * 就是直角坐标系转极坐标
 * r = (x^2+y^2)^0.5
 * θ = arctan(y/x)
 */
 

public class CartesianToPolar {
    public static void main(String[] args) {
        double x = Double.parseDouble(args[0]);
        double y = Double.parseDouble(args[1]);
        
        double r      = Math.sqrt(x * x + y * y);
        double theta  = Math.atan2(y, x);
        System.out.println("r = " + r + ", theta = " + theta);
    }
}