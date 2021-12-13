/*
cl main.c
main < seiseki.dat
*/
// data check
#include <stdio.h>
#include <string.h>
// isupper・islower・isdigit
#include <ctype.h>
// atoi
#include <stdlib.h>
#define LENGTH 80
#define E_LENGTH 6
// 各エラー項目のインデックスを定数で管理
#define SP 0
#define CM 1
#define CL 2
#define NO 3
#define NA 4
#define PO 5
int main(void) {
  char str[LENGTH];      // 1行分の文字列
  char *p_str;
  char cpy_str[LENGTH];  // 1行分の文字列のコピー
  char *p_cpy;
  char *p_i;
  int upper;             // 大文字判定の結果を格納する変数
  int lower;             // 小文字判定の結果を格納する変数
  int digit;             // 数値判定の結果を格納する変数
  int rec_count = 0;     // レコード数
  int cm_count;          // カンマの数
  char *err_str[] = {    // エラー項目を示す文字列の配列
    "SP", "CM", "CL", "NO", "NA", "PO"
  };
  char **p_err_str;
  int err_flg[E_LENGTH]; // 各エラー項目のフラグ配列
  int *p_err_flg;
  int err_count;         // 発生したエラー数
  int max_size[] = {     // 各項目の最大サイズ
    1, 1, 10, 3
  };
  int i;
  int size;             // 項目のサイズ
  int point;            // 数値を数字化したものを格納する変数
  
  // 1 行 1 文字ずつチェックしていく
  while(fgets(str, LENGTH, stdin) != NULL) {
    strcpy(cpy_str, str); // 1行丸ごとコピー
    
    // ポインタ位置の初期化
    p_str = str;
    p_cpy = cpy_str;
    
    // カウンタの初期化
    cm_count = 0;
    err_count = 0;
    
    // 各エラー項目のフラグの初期化
    for (p_err_flg = err_flg; p_err_flg < err_flg + E_LENGTH; p_err_flg++) {
      *p_err_flg = 0;
    }
    rec_count++;
    
    // 文字列型ポインタのインクリメントで一文字ずつ見ていく
    while (*p_cpy != '\0') {
      // 改行コード の場合
      // fgets() で取得される末尾の改行コードを NULL 文字に置換する
      if (*p_cpy == '\n') {
        *p_str = '\0';
      }
      // スペース の場合
      if (*p_cpy == ' ' && !err_flg[SP]) {
        err_flg[SP] = 1;
        err_count++;
      }
      // カンマ の場合
      if (*p_cpy == ',') {
        cm_count++;
      }
      // 区切り文字 の場合
      // NULL 文字に置換しておき、後述の strlen() で項目単位で扱えるようにしておく。
      if (isupper(*p_cpy) == 0 && islower(*p_cpy) == 0 && isdigit(*p_cpy) == 0) {
        *p_cpy = '\0';
      }
      p_str++;
      p_cpy++;
    } // end inner while
    
    // スペースとカンマのエラーがあれば詳細判定しない
    if (cm_count < 3) {
      err_flg[CM] = 1;
      err_count++;
    } else if (err_flg[SP]) { // 何もしない
      ;
    } else { // 詳細判定
      p_cpy = cpy_str;
      // カンマの数で項目の条件を振り分ける
      for (i = 0; i <= cm_count; i++) {
        size = strlen(p_cpy); // 項目のサイズを取得
        // 項目のサイズ判定
        if (size > max_size[i]) {
          err_flg[i + 2] = 1; // CL・NO・NA・PO の中から該当するエラーフラグを立てる
          err_count++;
        } else {
          switch (i) {
            case 0: // クラス の場合
              // 正：1 文字で大文字の A B C のみ
              if (*p_cpy != 'A' && *p_cpy != 'B' && *p_cpy != 'C') {
                err_flg[CL] = 1;
                err_count++;
              }
              break;
            case 1:// NO の場合
              // 正：1 桁の数字で 1 ～ 5
              if (*p_cpy < '1' || *p_cpy > '5') { // [文字] なので [''] で括った数字で比較
                err_flg[NO] = 1;
                err_count++;
              }
              break;
            case 2: // 名前 の場合
              // 正：先頭が大文字で、それ以外は小文字。
              p_i = p_cpy;
              upper = isupper(*p_i);
              // 先頭が大文字の場合
              if (upper != 0) {
                // 以降の小文字判定をする
                for (p_i++; p_i < p_cpy + size; p_i++) {
                  lower = islower(*p_i);
                  if (lower == 0) {
                    break;
                  }
                }
              }
              // 一文字目が大文字でない または 2文字目以降に小文字でない文字がある
              if (upper == 0 || lower == 0) {
                err_flg[NA] = 1;
                err_count++;
              }
              break;
            case 3: // 点数 の場合
              // 数字か判定
              for (p_i = p_cpy; p_i < p_cpy + size; p_i++) {
                digit = isdigit(*p_cpy);
                if (digit == 0) {
                  break;
                }
              }
              // 数字を数値化
              point = atoi(p_cpy);
              // 数字でない または 数値が範囲外の場合
              if (digit == 0 || (point < 0 || point > 100)) {
                err_flg[PO] = 1;
                err_count++;
              }
              break;
          }
        }
        // ポインタを進めて次の項目の先頭の文字に合わせる
        // ポインタを [文字サイズ + 1] 文字分進めると次の項目を示す
        p_cpy += size + 1;
      }
    } // end else
    
    // エラーの出力
    if (err_count) {
      // レコード数と1行分の文字列を結合
      sprintf(cpy_str, "%d:%s:", rec_count, str); // cpy_str はもう使わないので結合用に再利用
      
      // エラーフラグとエラー文字列を一緒にループ
      for (p_err_flg = err_flg, p_err_str = err_str; p_err_flg < err_flg + E_LENGTH; p_err_flg++, p_err_str++) {
        // エラーフラグが立っている場合
        if (*p_err_flg) {
          strcat(cpy_str, *p_err_str); // エラー区分を結合
          if (err_count > 1) {
            strcat(cpy_str, ","); // 区分の区切り文字を結合
            err_count--;
          }
        }
      }
      strcat(cpy_str, "\n");
      // 一通り結合したものをファイルへ出力する
      fputs(cpy_str, stdout);
    }
  } // end while outer
  return 0;
}