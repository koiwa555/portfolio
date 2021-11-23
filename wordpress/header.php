<!DOCTYPE html>
<html lang="ja">
<head>
<!-- <head prefix="og: https://ogp.me/ns# fb: https://ogp.me/ns/fb# website: https://ogp.me/ns/（ページの種類）#"> -->
  <meta charset="UTF-8">
  <!-- IE 最適化 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="email=no, telephone=no, address=no">
  
  <!-- 後で調整する -->
  <!--
  <meta name="description" content="">
  <meta name="keywords" content="">
  <link rel="canonical" href="（正しいページURL）">
  -->
  
  <!-- OGP -->
  <!--
  <meta property="og:type" content="（ページの種類）">
  <meta property="og:title" content="（ページの タイトル）">
  <meta property="og:description" content="（ページの説明）">
  <meta property="og:url" content="（ページのURL）">
  <meta property="og:image" content="（ogp画像のURL）">
  <meta property="og:site_name" content="（サイトタイトル）">
  <meta property="og:locale" content="ja_JP">
  -->
  <!--Twitter Card-->
  <!--
  <meta name="twitter:card" content="（カード種類）">
  <meta name="twitter:site" content="（@Twitterユーザー名）">
  -->
  <!-- Facebook -->
  <!--
  <meta property="og:admins" content="（FBのID）">
  -->
  
  <!-- icon -->
  <link rel="icon" href="<?= get_template_directory_uri(); ?>/favicon.ico"><!-- 32×32 -->
  <link rel="icon" type="image/svg+xml" href="<?= get_template_directory_uri(); ?>/icon.svg">
  <link rel="apple-touch-icon" href="<?= get_template_directory_uri(); ?>/apple-touch-icon.png"><!-- 180×180 -->
  
  <!-- 構造化マークアップ -->
  <!-- Global site tag (gtag.js) - Google Analytics -->
<?php wp_head(); ?>
  
</head>

<!-- body に動的にクラス名を出力する -->
<body id="body" <?php body_class('u-bg_dark_gray'); ?>>
  
  <?php wp_body_open(); ?>