/*
javac -encoding utf-8 Manager.java
*/
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.BufferedWriter;
// 入力もあるので FileNotFoundException も必要
import java.io.FileNotFoundException;
import java.io.IOException;

import java.util.Scanner;
import java.util.ArrayList;
// import java.util.InputMismatchException;

public class Manager {
  // クラス変数
  public static ArrayList<Book> books = new ArrayList<>();
  
  // プログラム実行時にファイルからリストに登録する
  public static void addList() {
    try (BufferedReader br = new BufferedReader(new FileReader("books.mst"))) {
      String data;
      
      while ((data = br.readLine()) != null) {
        String[] strArr = data.split(",");
        // int 型だけパース
        // ファイルは正しいデータだけなのでパースの例外は不要
        int no = Integer.parseInt(strArr[0]);
        int price = Integer.parseInt(strArr[3]);
        Book book = new Book(no, strArr[1], strArr[2], price);
        books.add(book);
      }
    } catch (FileNotFoundException e) {
      System.out.println("ファイル [books.mst] が見つかりません。");
    } catch (IOException e) {
      System.out.println("ファイル入出力エラー");
    }
  }
  
  // 処理区分 1
  public static void addBook() {
    Scanner scanner = new Scanner(System.in);
    System.out.println("*** 登録処理 ***");
    
    // この 2 行では例外でないので外に出しておく
    System.out.print("番号 ==> ");
    String inputNo = scanner.nextLine();
    try {
      int no = checkParseInt(inputNo);
      checkPositiveInteger(no);
      
      // 登録済みか判定する
      // indexCount はヒット判定のための添え字
      int indexCount = searchNo(no);
      
      // 登録済みの場合
      if (indexCount != books.size()) {
        System.out.println("[" + no + "] は既に登録されています。上書きしますか？");
        boolean answer = checkAnswer();
        if (!answer) {
          System.out.println("登録処理を中断します");
          return;
        }
      }
      
      System.out.print("書名 ==> ");
      String name = scanner.nextLine();
      
      System.out.print("著者 ==> ");
      String author = scanner.nextLine();
      
      System.out.print("価格 ==> ");
      String inputPrice = scanner.nextLine();
      int price = checkParseInt(inputPrice);
      checkPositiveInteger(price);
      
      Book book = new Book(no, name, author, price);
      // ArrayList に追加
      books.add(book);
      System.out.println("登録しました");
    } catch (ManagerException e) {
      System.out.println("登録エラー:" + e.getMessage());
    }
  }
  
  // 処理区分 2
  public static void changePrice() {
    System.out.println("*** 価格変更処理 ***");
    try {
      // 見つからない場合は例外となるので、返り値は全て存在する番号となる。
      int index = inputSearchNo();
      // リストから添え字でインスタンスを取得
      Book book = books.get(index);
      System.out.println("書籍データ:" + book);
      System.out.println("現在の価格:" + book.getPrice() + "円");
      
      Scanner scanner = new Scanner(System.in);
      System.out.print("新価格 ==> ");
      String inputPrice = scanner.nextLine();
      int price = checkParseInt(inputPrice);
      checkPositiveInteger(price);
      
      System.out.println(price + "円に変更してよろしいですか？");
      boolean answer = checkAnswer();
      if (!answer) {
        System.out.println("価格変更処理を中断します");
        return;
      }
      
      book.setPrice(price);
      System.out.println("価格を変更しました");
    } catch (ManagerException e) {
      System.out.println("価格変更エラー:" + e.getMessage());
    }
  }
  
  // 処理区分 3
  public static void deleteBook() {
    System.out.println("*** 削除処理 ***");
    try {
      int index = inputSearchNo();
      Book book = books.get(index);
      
      System.out.println("書籍データ:" + book);
      System.out.println("削除してよろしいですか？");
      
      boolean answer = checkAnswer();
      if (!answer) {
        System.out.println("削除処理を中断します");
        return;
      }
      
      books.remove(index);
      System.out.println("削除しました");
    } catch (ManagerException e) {
      System.out.println("削除エラー:" + e.getMessage());
    }
  }
  
  // 番号検索
  // 見つかった場合に 添え字、見つからなかった場合に 添え字 と 入力値
  // を返す必要があったので例外で処理した。
  public static int inputSearchNo() throws ManagerException {
    Scanner scanner = new Scanner(System.in);
    
    System.out.print("番号 ==> ");
    String inputNo = scanner.nextLine();
    int no = checkParseInt(inputNo);
    
    // リストを数えるための添え字 兼 ヒット時の返り値
    int indexCount = searchNo(no);
    
    // 見つからなかった場合
    // 添え字 と 要素数を比較
    if (indexCount == books.size())
      throw new ManagerException("[" + no + "] は登録されていません。");
    
    return indexCount;
  }
  
  // 処理区分1, 2, 3 で共用
  public static int searchNo(int no) {
    int indexCount = 0;
    for (Book book: books) {
      if (no == book.getNo()) break;
      // 見つからなければカウントアップ
      indexCount++;
    }
    return indexCount;
  }
  
  // 処理区分 4
  public static void searchName() {
    Scanner scanner = new Scanner(System.in);
    
    System.out.println("*** 書名検索処理 ***");
    System.out.print("書名 ==> ");
    String inputName = scanner.nextLine();
    
    System.out.println("検索結果");
    boolean hitFlg = false;
    
    // 複数ヒットを考慮する
    for (Book book: books) {
      String bookName = book.getName();
      hitFlg = checkSearchResult(inputName, bookName, book, hitFlg);
    }
    if (!hitFlg) System.out.println("[" + inputName +"] は見つかりませんでした。");
  }
  
  // 処理区分 5
  public static void searchAuthor() {
    Scanner scanner = new Scanner(System.in);
    
    System.out.println("*** 著者検索処理 ***");
    System.out.print("著者 ==> ");
    String inputAuthor = scanner.nextLine();
    
    System.out.println("検索結果");
    boolean hitFlg = false;
    
    for (Book book: books) {
      String bookAuthor = book.getAuthor();
      hitFlg = checkSearchResult(inputAuthor, bookAuthor, book, hitFlg);
    }
    if (!hitFlg) System.out.println("[" + inputAuthor +"] は見つかりませんでした。");
  }
  
  // 検索ヒット時の処理
  private static boolean checkSearchResult(String a, String b, Book book, boolean hitFlg) {
    // 一致した場合
    if (a.equals(b)) {
      // 見つからなかったときにヘッダを出力させないため、見つかったときに出力…とするが、
      // 複数ヒット時に重複で見出しが出力されないようにフラグで判定する。
      if (!hitFlg) System.out.println("番号,書名,著者,価格");
      
      System.out.printf("%d,%s,%s,%d\n", book.getNo(), book.getName(), book.getAuthor(), book.getPrice());
      hitFlg = true;
    }
    return hitFlg;
  }
  
  // 処理区分 6
  public static void outputList() {
    System.out.println("*** 一覧表 ***");
    System.out.println("書籍, 番号, 著者, 価格");
    for (Book book: books) {
      System.out.println(book);
    }
  }
  
  // 処理区分 9
  public static void managementEnd() {
    // 上書きではなく追加の場合はファイル名の隣に [true] を記述する
    // 今回は管理開始時にファイルから全てリストに移し、もろもろの処理が
    // 済んだら、ファイルに全て戻すので上書きでOK。
    try (BufferedWriter bw = new BufferedWriter(new FileWriter("books.mst"))) {
      for (Book book: books) {
        String str = String.format("%d,%s,%s,%d\n", book.getNo(), book.getName(), book.getAuthor(), book.getPrice());
        bw.write(str);
      }
    } catch (IOException e) {
      // 出力なので IOException だけ
      System.out.println("ファイル入出力エラー");
    }
  }
  
  // 正の整数チェック
  private static void checkPositiveInteger(int num) throws ManagerException  {
    if (num < 0) throw new ManagerException("["+ num + "] は正の整数ではありません。");
  }
  
  // 数値チェック
  private static int checkParseInt(String str) throws ManagerException  {
    int num = 0;
    try {
      num = Integer.parseInt(str);
    } catch (NumberFormatException e) {
      throw new ManagerException("["+ str + "] は数値ではありません。");
    }
    return num;
  }
  
  private static boolean checkAnswer() {
    Scanner scanner = new Scanner(System.in);
    boolean answer = false;
    
    while (true) {
      System.out.print("y or n ==> ");
      String input = scanner.nextLine();
      
      if (input.equals("y")) {
        answer = true;
        break;
      } else if (input.equals("n")) {
        answer = false;
        break;
      }
      System.out.println("[y]か[n]を入力してください");
    }
    return answer;
  }
}
