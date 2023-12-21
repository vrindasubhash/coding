public class Main {
    public static void main(String[] args) {

        Integer a = 10;
        System.out.println(System.identityHashCode(a));
        boxing_unboxing(a);
        System.out.println(a);
    }

    static void boxing_unboxing(Integer a) {
        a = a + 1;
        System.out.println("a1 now: " + a);
        System.out.println(System.identityHashCode(a));
    }
}