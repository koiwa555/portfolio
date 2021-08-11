<?php
// 共通利用するメソッドを記述する

function h($s) {
  if (is_array($s)) {
    return array_map('h', $s);
  }
  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
