// Train fare search
#include <stdio.h>
#include <string.h>
// �w�̐�
#define ST_LENGTH 17
// �����ɉ��������z
#define PR_LENGTH 35
struct station_list {
  // Shift_JIS�F9 , UTF-8�F13
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
    {"����", 0.0},
    {"�i��", 6.8},
    {"�V���l", 22.0},
    {"���c��", 55.1},
    {"�M�C", 20.7},
    {"�O��", 16.1},
    {"�V�x�m", 25.5},
    {"�É�", 34.0},
    {"�|��", 49.1},
    {"�l��", 27.8},
    {"�L��", 36.5},
    {"�O�͈���", 42.7},
    {"���É�", 29.7},
    {"�򕌉H��", 30.3},
    {"�Č�", 49.6},
    {"���s", 67.7},
    {"�V���", 39.0}
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
  // �������[�v�̂��߂Ɉُ�l�������l�Ƃ���
  double distance_end = -1;
  double distance_result;
  int price;
  int end_flg;
  
  printf("���C���V�����̏o���w���瓞���w�܂ł̋����Ɖ^����\�����܂��B\n");
  printf("�I�����鎞�� �h�I���h ����͂��Ă��������B\n");
  printf("-------------------------------------------------------------\n");
  
  // ��ǂ�
  printf("�o���w������͂��Ă�������  (�����I���� : �I��)  ==> ");
  scanf("%s", in_start);
  
  // A ���������Ă͂��߂� B ����͂�����c�Ƃ������̂�
  // while �̓�d���[�v�Ƃ���
  while (strcmp(in_start, "�I��") != 0) { // �I���łȂ���
    // �w���ŃT�[�`
    distance_start = searchName(in_start, st_data);
    // �T�[�`���ʂ̔���
    if (distance_start == -1) { // ������Ȃ������ꍇ
      reInput(in_start); // �ē���
      continue;
    }
    
    // �������[�v�p��ǂ�
    printf("�����w������͂��Ă�������  (�����I���� : �I��)  ==> ");
    scanf("%s", in_end);
    // �p�������F�w���� [�I���łȂ�] ���� ������ [�ُ�l] �̊�
    // �I�������F�w���� [�I��] �܂��� ������ [�ُ�l�łȂ� (��������)] �Ƃ�
    while ((end_flg = strcmp(in_end, "�I��")) != 0 && distance_end == -1) {
      // �o���w�Ɠ����w�������ꍇ
      // �ē���
      if (strcmp(in_start, in_end) == 0) {
        printf("�w���������ł�  �����w��������x���͂��Ă������� ==> ");
        scanf("%s", in_end);
        continue;
      }
      distance_end = searchName(in_end, st_data);
      if (distance_end == -1) {
        reInput(in_end);
      }
    }
    // ������ [�I��] ���͂ŊO���̃��[�v��������
    if (end_flg == 0) {
      break;
    }
    
    // �������������Ă����� ----------------------------------------
    
    // 2 �_�Ԃ̋��������߂�
    distance_result = distance_start - distance_end;
    distance_result = distance_result > 0 ? distance_result : - distance_result;
    
    price = searchDistance(distance_result, pr_data);
    printf("%s �` %s �̋����� %.1fKm �� ���ʉ^���� %d �~�ł�\n", in_start, in_end, distance_result, price);
    printf("---------------------------------------------------------\n");
    
    // ���������[�v����悤�Ɉُ�l�ɖ߂��Ă���
    distance_end = -1;
    // ��ǂ�
    printf("�o���w������͂��Ă�������  (�����I���� : �I��)  ==> ");
    scanf("%s", in_start);
  } // end while
  
  printf("�������I�����܂�\n");
  return 0;
}

// �w������
double searchName(char *input, struct station_list *p_data) {
  struct station_list *p_i;
  double total_distance = 0;
  
  for (p_i = p_data; p_i < p_data + ST_LENGTH; p_i++) {
    total_distance += p_i->distance;
    // ��v�����ꍇ
    if (strcmp(input, p_i->name) == 0) {
      break;
    }
  }
  // ������Ȃ������ꍇ
  if (p_i == p_data + ST_LENGTH) {
    // �Ԃ�l���ُ�l�ɂ��ĕԂ�
    total_distance = -1;
  }
  return total_distance;
}

// �ē���
void reInput(char *input) {
  printf("�w�����Ⴂ�܂�  ������x���͂��Ă�������         ==> ");
  scanf("%s", input);
  return;
}

// �����ŗ�������
int searchDistance(double total_distance, struct price_list *p_data) {
  struct price_list *p_i;
  
  // �����ŃT�[�`
  p_i = p_data;
  if (total_distance < p_i->distance) { // �ǂݔ�΂�
    // �v�f 0 �Ԗڂ̔���
    ;
  } else {
    // �v�f 1 �Ԗڈȍ~�̔���
    for (p_i++; p_i <= p_data + PR_LENGTH; p_i++) {
      // ���݂̃��[�v�� [����] ��菬�����ꍇ
      if (total_distance <= p_i->distance) {
        break;
      }
    }
  }
  return p_i->price;
}