/*
javac -encoding utf-8 Book.java
*/
public class Book {
  private int no;
  private String name;
  private String author;
  private int price;
  
  public Book(int no, String name, String author, int price) {
    this.no = no;
    this.name = name;
    this.author = author;
    this.price = price;
  }
  public void setPrice(int price) {
    this.price = price;
  }
  public int getNo() {
    return no;
  }
  public String getName() {
    return name;
  }
  public String getAuthor() {
    return author;
  }
  public int getPrice() {
    return price;
  }
  public String toString() {
    return String.format("%d,%s,%s,%d", no, name, author, price);
  }
}
