/*
javac -encoding utf-8 BookManagement.java
java BookManagement
*/
import java.util.Scanner;
import java.util.ArrayList;
public class BookManagement {
  public static void main(String[] args) {
    System.out.println("書籍管理を開始します");
    // books.mst ファイルの内容を読み込んでリストに追加する
    Manager.addList();
    
    while (true) {
      // 先読みと後ろ読みのだとtry・catchが2ヵ所必要になるので、
      // 無限ループの中間判定とする
      System.out.println("*** 書籍管理メニュー ***");
      System.out.println("1:登録 2:価格変更 3:削除 4:書名検索 5:著者検索 6:一覧表 9:終了\n");
      System.out.print("処理区分 ==> ");
      Scanner scanner = new Scanner(System.in);
      String input = scanner.nextLine();
      
      try {
        int division = Integer.parseInt(input);
        if (division == 9) {
          break;
        } else if (division < 1 || division > 6) {
          // switch の前にエラー判定
          System.out.println("処理区分エラー:[" + division + "] は存在しません\n");
        } else {
          // 各クラスメソッドを呼び出す
          switch (division) {
            case 1:
              Manager.addBook();
              break;
            case 2:
              Manager.changePrice();
              break;
            case 3:
              Manager.deleteBook();
              break;
            case 4:
              Manager.searchName();
              break;
            case 5:
              Manager.searchAuthor();
              break;
            case 6:
              Manager.outputList();
              break;
            // default は不要
          }
        }
        System.out.println();
      } catch (NumberFormatException e) {
        System.out.println("処理区分エラー:[" + input + "] は数値ではありません\n");
      }
      
    } // end while
    Manager.managementEnd();
    System.out.println("書籍管理を終了します");
  }
}
