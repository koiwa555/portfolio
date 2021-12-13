/*
cl main.c
main < seiseki.dat
*/
// data check
#include <stdio.h>
#include <string.h>
// isupper�Eislower�Eisdigit
#include <ctype.h>
// atoi
#include <stdlib.h>
#define LENGTH 80
#define E_LENGTH 6
// �e�G���[���ڂ̃C���f�b�N�X��萔�ŊǗ�
#define SP 0
#define CM 1
#define CL 2
#define NO 3
#define NA 4
#define PO 5
int main(void) {
  char str[LENGTH];      // 1�s���̕�����
  char *p_str;
  char cpy_str[LENGTH];  // 1�s���̕�����̃R�s�[
  char *p_cpy;
  char *p_i;
  int upper;             // �啶������̌��ʂ��i�[����ϐ�
  int lower;             // ����������̌��ʂ��i�[����ϐ�
  int digit;             // ���l����̌��ʂ��i�[����ϐ�
  int rec_count = 0;     // ���R�[�h��
  int cm_count;          // �J���}�̐�
  char *err_str[] = {    // �G���[���ڂ�����������̔z��
    "SP", "CM", "CL", "NO", "NA", "PO"
  };
  char **p_err_str;
  int err_flg[E_LENGTH]; // �e�G���[���ڂ̃t���O�z��
  int *p_err_flg;
  int err_count;         // ���������G���[��
  int max_size[] = {     // �e���ڂ̍ő�T�C�Y
    1, 1, 10, 3
  };
  int i;
  int size;             // ���ڂ̃T�C�Y
  int point;            // ���l�𐔎����������̂��i�[����ϐ�
  
  // 1 �s 1 �������`�F�b�N���Ă���
  while(fgets(str, LENGTH, stdin) != NULL) {
    strcpy(cpy_str, str); // 1�s�ۂ��ƃR�s�[
    
    // �|�C���^�ʒu�̏�����
    p_str = str;
    p_cpy = cpy_str;
    
    // �J�E���^�̏�����
    cm_count = 0;
    err_count = 0;
    
    // �e�G���[���ڂ̃t���O�̏�����
    for (p_err_flg = err_flg; p_err_flg < err_flg + E_LENGTH; p_err_flg++) {
      *p_err_flg = 0;
    }
    rec_count++;
    
    // ������^�|�C���^�̃C���N�������g�ňꕶ�������Ă���
    while (*p_cpy != '\0') {
      // ���s�R�[�h �̏ꍇ
      // fgets() �Ŏ擾����閖���̉��s�R�[�h�� NULL �����ɒu������
      if (*p_cpy == '\n') {
        *p_str = '\0';
      }
      // �X�y�[�X �̏ꍇ
      if (*p_cpy == ' ' && !err_flg[SP]) {
        err_flg[SP] = 1;
        err_count++;
      }
      // �J���} �̏ꍇ
      if (*p_cpy == ',') {
        cm_count++;
      }
      // ��؂蕶�� �̏ꍇ
      // NULL �����ɒu�����Ă����A��q�� strlen() �ō��ڒP�ʂň�����悤�ɂ��Ă����B
      if (isupper(*p_cpy) == 0 && islower(*p_cpy) == 0 && isdigit(*p_cpy) == 0) {
        *p_cpy = '\0';
      }
      p_str++;
      p_cpy++;
    } // end inner while
    
    // �X�y�[�X�ƃJ���}�̃G���[������Ώڍה��肵�Ȃ�
    if (cm_count < 3) {
      err_flg[CM] = 1;
      err_count++;
    } else if (err_flg[SP]) { // �������Ȃ�
      ;
    } else { // �ڍה���
      p_cpy = cpy_str;
      // �J���}�̐��ō��ڂ̏�����U�蕪����
      for (i = 0; i <= cm_count; i++) {
        size = strlen(p_cpy); // ���ڂ̃T�C�Y���擾
        // ���ڂ̃T�C�Y����
        if (size > max_size[i]) {
          err_flg[i + 2] = 1; // CL�ENO�ENA�EPO �̒�����Y������G���[�t���O�𗧂Ă�
          err_count++;
        } else {
          switch (i) {
            case 0: // �N���X �̏ꍇ
              // ���F1 �����ő啶���� A B C �̂�
              if (*p_cpy != 'A' && *p_cpy != 'B' && *p_cpy != 'C') {
                err_flg[CL] = 1;
                err_count++;
              }
              break;
            case 1:// NO �̏ꍇ
              // ���F1 ���̐����� 1 �` 5
              if (*p_cpy < '1' || *p_cpy > '5') { // [����] �Ȃ̂� [''] �Ŋ����������Ŕ�r
                err_flg[NO] = 1;
                err_count++;
              }
              break;
            case 2: // ���O �̏ꍇ
              // ���F�擪���啶���ŁA����ȊO�͏������B
              p_i = p_cpy;
              upper = isupper(*p_i);
              // �擪���啶���̏ꍇ
              if (upper != 0) {
                // �ȍ~�̏��������������
                for (p_i++; p_i < p_cpy + size; p_i++) {
                  lower = islower(*p_i);
                  if (lower == 0) {
                    break;
                  }
                }
              }
              // �ꕶ���ڂ��啶���łȂ� �܂��� 2�����ڈȍ~�ɏ������łȂ�����������
              if (upper == 0 || lower == 0) {
                err_flg[NA] = 1;
                err_count++;
              }
              break;
            case 3: // �_�� �̏ꍇ
              // ����������
              for (p_i = p_cpy; p_i < p_cpy + size; p_i++) {
                digit = isdigit(*p_cpy);
                if (digit == 0) {
                  break;
                }
              }
              // �����𐔒l��
              point = atoi(p_cpy);
              // �����łȂ� �܂��� ���l���͈͊O�̏ꍇ
              if (digit == 0 || (point < 0 || point > 100)) {
                err_flg[PO] = 1;
                err_count++;
              }
              break;
          }
        }
        // �|�C���^��i�߂Ď��̍��ڂ̐擪�̕����ɍ��킹��
        // �|�C���^�� [�����T�C�Y + 1] �������i�߂�Ǝ��̍��ڂ�����
        p_cpy += size + 1;
      }
    } // end else
    
    // �G���[�̏o��
    if (err_count) {
      // ���R�[�h����1�s���̕����������
      sprintf(cpy_str, "%d:%s:", rec_count, str); // cpy_str �͂����g��Ȃ��̂Ō����p�ɍė��p
      
      // �G���[�t���O�ƃG���[��������ꏏ�Ƀ��[�v
      for (p_err_flg = err_flg, p_err_str = err_str; p_err_flg < err_flg + E_LENGTH; p_err_flg++, p_err_str++) {
        // �G���[�t���O�������Ă���ꍇ
        if (*p_err_flg) {
          strcat(cpy_str, *p_err_str); // �G���[�敪������
          if (err_count > 1) {
            strcat(cpy_str, ","); // �敪�̋�؂蕶��������
            err_count--;
          }
        }
      }
      strcat(cpy_str, "\n");
      // ��ʂ茋���������̂��t�@�C���֏o�͂���
      fputs(cpy_str, stdout);
    }
  } // end while outer
  return 0;
}