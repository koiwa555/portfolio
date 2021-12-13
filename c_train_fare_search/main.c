// Train fare search
#include <stdio.h>
#include <string.h>
// 駅の数
#define ST_LENGTH 17
// 距離に応じた金額
#define PR_LENGTH 35
struct station_list {
  // Shift_JIS：9 , UTF-8：13
  char name[13];
  double distance;
};
struct price_list {
  int distance;
  int price;
};
double searchName(char *input, struct station_list *p_data);
void reInput(char *input);
int searchDistance(double distance, struct price_list *p_data);
int main(void) {
  struct station_list st_data[ST_LENGTH] = {
    {"東京", 0.0},
    {"品川", 6.8},
    {"新横浜", 22.0},
    {"小田原", 55.1},
    {"熱海", 20.7},
    {"三島", 16.1},
    {"新富士", 25.5},
    {"静岡", 34.0},
    {"掛川", 49.1},
    {"浜松", 27.8},
    {"豊橋", 36.5},
    {"三河安城", 42.7},
    {"名古屋", 29.7},
    {"岐阜羽島", 30.3},
    {"米原", 49.6},
    {"京都", 67.7},
    {"新大阪", 39.0}
  };
  struct price_list pr_data[PR_LENGTH] = {
    {10, 160},
    {25, 400},
    {30, 480},
    {35, 570},
    {40, 650},
    {45, 740},
    {50, 820},
    {60, 950},
    {70, 1110},
    {80, 1280},
    {90, 1450},
    {100, 1620},
    {120, 1890},
    {140, 2210},
    {160, 2520},
    {180, 2940},
    {200, 3260},
    {220, 3570},
    {240, 3890},
    {260, 4310},
    {280, 4620},
    {300, 4940},
    {320, 5250},
    {340, 5460},
    {360, 5780},
    {380, 6090},
    {400, 6300},
    {420, 6620},
    {440, 6830},
    {460, 7140},
    {480, 7350},
    {500, 7670},
    {520, 7980},
    {540, 8190},
    {560, 8510}
  };
  char in_start[9];
  char in_end[9];
  double distance_start;
  // 内側ループのために異常値を初期値とする
  double distance_end = -1;
  double distance_result;
  int price;
  int end_flg;
  
  printf("東海道新幹線の出発駅から到着駅までの距離と運賃を表示します。\n");
  printf("終了する時は ”終了” を入力してください。\n");
  printf("-------------------------------------------------------------\n");
  
  // 先読み
  printf("出発駅名を入力してください  (処理終了時 : 終了)  ==> ");
  scanf("%s", in_start);
  
  // A が正しくてはじめて B を入力させる…としたいので
  // while の二重ループとした
  while (strcmp(in_start, "終了") != 0) { // 終了でない間
    // 駅名でサーチ
    distance_start = searchName(in_start, st_data);
    // サーチ結果の判定
    if (distance_start == -1) { // 見つからなかった場合
      reInput(in_start); // 再入力
      continue;
    }
    
    // 内側ループ用先読み
    printf("到着駅名を入力してください  (処理終了時 : 終了)  ==> ");
    scanf("%s", in_end);
    // 継続条件：駅名が [終了でない] かつ 距離が [異常値] の間
    // 終了条件：駅名が [終了] または 距離が [異常値でない (見つかった)] とき
    while ((end_flg = strcmp(in_end, "終了")) != 0 && distance_end == -1) {
      // 出発駅と到着駅が同じ場合
      // 再入力
      if (strcmp(in_start, in_end) == 0) {
        printf("駅名が同じです  到着駅をもう一度入力してください ==> ");
        scanf("%s", in_end);
        continue;
      }
      distance_end = searchName(in_end, st_data);
      if (distance_end == -1) {
        reInput(in_end);
      }
    }
    // 内側で [終了] 入力で外側のループも抜ける
    if (end_flg == 0) {
      break;
    }
    
    // 両方見つかっっている状態 ----------------------------------------
    
    // 2 点間の距離を求める
    distance_result = distance_start - distance_end;
    distance_result = distance_result > 0 ? distance_result : - distance_result;
    
    price = searchDistance(distance_result, pr_data);
    printf("%s ～ %s の距離は %.1fKm で 普通運賃は %d 円です\n", in_start, in_end, distance_result, price);
    printf("---------------------------------------------------------\n");
    
    // 内側がループするように異常値に戻しておく
    distance_end = -1;
    // 後読み
    printf("出発駅名を入力してください  (処理終了時 : 終了)  ==> ");
    scanf("%s", in_start);
  } // end while
  
  printf("処理を終了します\n");
  return 0;
}

// 駅名検索
double searchName(char *input, struct station_list *p_data) {
  struct station_list *p_i;
  double total_distance = 0;
  
  for (p_i = p_data; p_i < p_data + ST_LENGTH; p_i++) {
    total_distance += p_i->distance;
    // 一致した場合
    if (strcmp(input, p_i->name) == 0) {
      break;
    }
  }
  // 見つからなかった場合
  if (p_i == p_data + ST_LENGTH) {
    // 返り値を異常値にして返す
    total_distance = -1;
  }
  return total_distance;
}

// 再入力
void reInput(char *input) {
  printf("駅名が違います  もう一度入力してください         ==> ");
  scanf("%s", input);
  return;
}

// 距離で料金検索
int searchDistance(double total_distance, struct price_list *p_data) {
  struct price_list *p_i;
  
  // 距離でサーチ
  p_i = p_data;
  if (total_distance < p_i->distance) { // 読み飛ばし
    // 要素 0 番目の判定
    ;
  } else {
    // 要素 1 番目以降の判定
    for (p_i++; p_i <= p_data + PR_LENGTH; p_i++) {
      // 現在のループの [距離] より小さい場合
      if (total_distance <= p_i->distance) {
        break;
      }
    }
  }
  return p_i->price;
}