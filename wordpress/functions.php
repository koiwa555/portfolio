<?php
// テーマディレクトリのパスを定数にする
define("TPL_DIR", get_template_directory_uri());


// テーマの設定
function add_setup_theme() {
  // WP 側で自動でタイトルを出力させる
  // <head> の <title>...</title> は削除する
  add_theme_support('title-tag');
  
  // アイキャッチ画像 (サムネイル 兼 OGP) を有効化する
  // 推奨サイズ：横1200ピクセル×縦630ピクセル
  // エディタにパネルが追加される
  add_theme_support('post-thumbnails');
  
  // HTML5 のサポート
  // HTML5 で不要になった属性などを出力しない
  add_theme_support(
    'html5',
    array(
      'search-form',
      'comment-form',
      'comment-list',
      'gallery',
      'caption'
    )
  );
  
  // カスタムメニュー機能を有効にする
  //
  // 管理画面 → 外観 → メニュー
  add_theme_support('menus');
  
  // グーテンバーグ用の追加設定 ------------------------------
  //
  //「幅広」と「全幅」に対応
  add_theme_support( 'align-wide' );
  
  // エディタに css を適用する
  add_theme_support('editor-styles');
  add_editor_style('assets/css/editor-style.css');
}
add_action('after_setup_theme', 'add_setup_theme');


// タイトルの区切り文字を変更する
function rewrite_title_separator($separator) {
  $separator = '|';
  return $separator;
}
add_filter('document_title_separator', 'rewrite_title_separator');


// トップページのタイトル書き換え
// description を出力させないようにする
function rewrite_top_page_title($title) {
  if (is_home()) {
    // [tagline] が description のこと
    // これをセットしないことで削除とする
    unset($title['tagline']);
  }
  return $title;
}
add_filter('document_title_parts', 'rewrite_top_page_title');


// 抜粋末尾の文字列を[…]から変更する
function rewrite_excerpt_more($more) {
  $more = '…<br>[続きを読む]';
  return $more;
}
add_filter('excerpt_more', 'rewrite_excerpt_more');


// アイキャッチ画像を表示する
function display_thumbnail() {
  if (has_post_thumbnail()) { // アイキャッチ画像がある場合
    echo the_post_thumbnail('medium');
  } else { // アイキャッチ画像がない場合
    echo '<img width="800" height="420" src="' . get_template_directory_uri() . '/assets/img/no_image.png" alt="">';
  }
}


// css・js ファイルの追加
function add_files() {
  // css の設定 --------------------------------------------------
  wp_enqueue_style(
    'base', // ハンドル名
    TPL_DIR . '/assets/css/base.css',
    array(),
    '20210802',
    // all // media 属性 (メディアクエリも記述できる)
  );
  
  wp_enqueue_style(
    'font-awesome',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    array(),
    '20210802',
  );
  
  // トップページの場合
  if (is_front_page()) {
    wp_enqueue_style(
      'com-category',
      TPL_DIR . '/assets/css/com-category.css',
      array(),
      '20210802',
    );
    wp_enqueue_style(
      'top',
      TPL_DIR . '/assets/css/top.css',
      array(),
      '20210802',
    );
    
    wp_enqueue_style(
      'font-hiragana',
      // [&text=〇〇〇] で指定した文字だけフォントを取得する
      'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@800&display=swap&text=これまでこれから',
      array(),
      '20210802',
    );
  } elseif (is_single()) { // 投稿ページの場合
    wp_enqueue_style(
      'com-post-header',
      TPL_DIR . '/assets/css/com-post-header.css',
      array('hcb-style'),
      '20210802',
    );
    wp_enqueue_style(
      'post',
      TPL_DIR . '/assets/css/post.css',
      // プラグインの css を上書きするために先に読ませる
      array('hcb-style'),
      '20210802',
    );
    // 日本語フォントで必要な文字列として記事の見出しを取得する
    $str = '&text' . get_head_str();
    wp_enqueue_style(
      'font-head',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap' . $str,
      array(),
      '20210802',
    );
  } elseif (is_archive()) { // アーカイブページの場合
    wp_enqueue_style(
      'com-post-header',
      TPL_DIR . '/assets/css/com-post-header.css',
      array('hcb-style'),
      '20210802',
    );
    wp_enqueue_style(
      'com-category',
      TPL_DIR . '/assets/css/com-category.css',
      array(),
      '20210802',
    );
  } elseif (is_404()) { // アーカイブページの場合
    wp_enqueue_style(
      'com-post-header',
      TPL_DIR . '/assets/css/com-post-header.css',
      array('hcb-style'),
      '20210802',
    );
    wp_enqueue_style(
      'page_404',
      TPL_DIR . '/assets/css/page_404.css',
      array(),
      '20210802',
    );
    wp_enqueue_style(
      'font-head',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap&textページが見つかりませんでした',
      array(),
      '20210802',
    );
  }
  
  wp_enqueue_style(
    'font-en',
    'https://fonts.googleapis.com/css2?family=Istok+Web:wght@400;700&display=swap',
    array(),
    '20210802',
  );
  
  // js の設定 --------------------------------------------------
  
  // WordPress 提供の jquery.js を読み込まない
	wp_deregister_script('jquery');
  
  // jQuery の読み込み
  wp_enqueue_script(
    'jquery',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    array(),
    '20210802',
    // footer で読み込むので、プラグインを入れるたびに要動作検証！！
    true // trueで wp_footer() で読み込む
  );
  
  wp_enqueue_script(
    // [common] は WP で用意された common-min.js だかを読んでしまうみたい
    // パスを指定してもダメだったので、ユニーク名を変更した。
    'own-common',
    TPL_DIR . '/assets/js/common.js',
    array(),
    '20210802',
    true
  );
  // smooth scroll
  wp_enqueue_script(
  'scroll',
  TPL_DIR . '/assets/js/float_scroll.js',
  array(),
  '20210802',
  true
  );
  
  if (is_front_page()) {
    wp_enqueue_script(
      'top',
      TPL_DIR . '/assets/js/top.js',
      array('own-common', 'scroll'),
      '20210802',
      true
    );
  } elseif (is_single()) {
    wp_enqueue_script(
      'post',
      TPL_DIR . '/assets/js/post.js',
      array('own-common', 'scroll'),
      '20210802',
      true
    );
  } elseif (is_archive()) {
    wp_enqueue_script(
      'archive',
      TPL_DIR . '/assets/js/archive.js',
      array('own-common', 'scroll'),
      '20210802',
      true
    );
  }
}
add_action('wp_enqueue_scripts', 'add_files');


// エディタに css を適用する
function add_block_editor_files() {
  wp_enqueue_style(
    'font-head',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&display=swap',
    array(),
    '20210802',
  );
  wp_enqueue_style(
    'font-en',
    'https://fonts.googleapis.com/css2?family=Istok+Web:wght@400;700&display=swap',
    array(),
    '20210802',
  );
  wp_enqueue_style(
    'font-awesome',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    array(),
    '20210802',
  );
}
add_action('enqueue_block_editor_assets', 'add_block_editor_files');


// css 用 link タグの書き換え
function replace_link_tag($tag, $handle, $src) {
  // Font Awesome の場合は書き換え不要
  if($handle !== 'font-awesome') return $tag;
  
  return "<link rel='stylesheet' id='" . $handle ."-css'  href='" . $src . "' type='text/css' media='all' crossorigin='anonymous' />\n";
}
add_filter('style_loader_tag', 'replace_link_tag', 10, 3);


// script タグの書き換え
// function replace_script_tag($tag, $handle) {
//   ...
// }
// add_filter('script_loader_tag', 'replace_script_tag', 10, 2);


// ウィジェット を表示する
function add_widgets(){
  // サイドナビの目次
  register_sidebar(array(
    'name' => 'ページナビ', // ウィジェットの名前
    'description' => 'ページナビーのウィジェット', // 概要
    'id' => 'page_nav', // 出力で利用する ID 名
    // 未指定だと謎の li タグで囲われるので、空文字にしておく。
    'before_widget' => '', // ウィジェットを囲う開始タグ
    'after_widget' => '', // ウィジェットを囲う閉じタグ
    // 'before_title' => '<h3>', // ウィジェットのタイトルを囲う開始タグ
    // 'after_title' => '</h3>' // ウィジェットのタイトルを囲う閉じタグ
  ));
}
add_action('widgets_init', 'add_widgets');


// google フォント用に記事の見出し用の文字列を全て取得する
function get_head_str() {
  // head 要素内で利用するので WP ループ内ではないため $post を利用する
  global $post;
  
  // h1 を先んじて取得しておく
  $result = get_the_title();
  
  //正規表現で h1 ～ h6 を全て取得する
  // ※ここで取得できるのは title にあたる h1 以外の見出しになる
  preg_match_all('/<h[1-6]>(.+)<\/h[1-6]>/u', $post->post_content, $matches);
  
  // 取得した h 要素をカウント
  $count = count($matches[1]);
  
  // 見出しが存在すれば出力する
  for ($i = 0; $i < $count; $i++){
    $result .= $matches[1][$i];
  }
  return $result;
}


// Advanced Editor Tools のテーブル周りの設定
function customize_tiny_mce_settings($mceInit) {
  // width と height を指定できないようにする
  $invalid_style = array(
    'table' => 'width height',
    'th' => 'width height',
    'td' => 'width height'
  );
  $mceInit['invalid_styles'] = json_encode($invalid_style);
  
  // オプションの設定
  $mceInit['table_resize_bars'] = false; // テーブルのリサイズを無効
  $mceInit['object_resizing'] = "img"; // img をリサイズする？
  return $mceInit;
}
add_filter('tiny_mce_before_init', 'customize_tiny_mce_settings' ,0);


// デモページの存在チェック
// function existDemoPages() {
//   ...
// }


// ソースページの存在チェック
/*
function existSourcePages($slug) {
  // この配列に羅列したディレクトリであればソースページが存在する…としている
  $arr = [
    'bbs',
    'js_smooth_scroll',
    'js_modal'
  ];
  foreach ($arr as $str) {
    // 文字列の完全一致なので関数不要で比較するだけでおｋ
    if ($str === $slug) return true;
  }
  return false;
}
*/

// アーカイブページのタイトルを取得する
function get_archive_title() {
  //アーカイブページでない場合は false を返す
  if (!is_archive()) return false;
  
  //日付アーカイブページの場合
  if (is_date()) {
    if (is_year()) {
      $date_name = get_query_var('year') . '年';
    } elseif (is_month()) {
      $date_name = get_query_var('year') . '年' . get_query_var('monthnum') . '月';
    } else {
      $date_name = get_query_var('year') . '年' . get_query_var('monthnum') . '月' . get_query_var('day') . '日';
    }
    //日付アーカイブページかつ、投稿タイプアーカイブページでもある場合
    if (is_post_type_archive()) {
      return $date_name . "の" . post_type_archive_title('', false);
    }
    return $date_name;
  }
  
  //投稿タイプのアーカイブページの場合
  if (is_post_type_archive()) {
    return post_type_archive_title('', false);
  }
  
  //投稿者アーカイブページの場合
  if (is_author()) {
    return "投稿者" . get_queried_object()->data->display_name;
  }
  
  //それ以外の場合 (カテゴリ・タグ・タクソノミーアーカイブページ)
  return single_term_title('', false);
}


// アーカイブページのタイトル接頭辞削除
// 接頭辞を一律に削除する
add_filter('get_the_archive_title_prefix', function($prefix) {
  // 接頭辞 を空文字にする
  $prefix = '';
  return $prefix;
});


// body_class にクラス名を追加する
function add_body_class($classes) {
  // ページに高さが足りないときの fix 用クラス名を付与
  if (is_single() || is_archive() || is_404()) {
    $classes[] = 'adjust_height';
  }
  return $classes;
}
add_filter('body_class', 'add_body_class');


// カテゴリーのリストを自動で出力するメソッドにて
// a タグの中の文字列を span タグで囲うようにする
function rewrite_list_categories($list) {
  $list = preg_replace('/(<a .*?>)/', '${1}<span>', $list); // <a ...><span>
  $list = str_replace('</a>', '</span></a>', $list);        // </span></a>
return $list;
}
add_filter ('wp_list_categories', 'rewrite_list_categories');


// 指定したページ以外の場合に 404 ページを表示する
function redirect_404() {
  // default
  // if(is_home() || is_singular() || is_month() || is_category() || is_tag() || is_post_type_archive('rental') || is_search()) return;
  
  // 存在しているページタイプだけ抜粋
  if(is_home() || is_single() || is_category() || is_search()) return;
  
  //HTTP ステータスコード 404 を送信
  status_header(404);
  include TEMPLATEPATH . '/404.php';
  // リダイレクトをここで止める
  exit();
}
add_action('template_redirect', 'redirect_404');


// 特殊文字の絵文字変換を無効化する
function disable_emoji() {
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('admin_print_scripts', 'print_emoji_detection_script');
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action('admin_print_styles', 'print_emoji_styles');
  remove_filter('the_content_feed', 'wp_staticize_emoji');
  remove_filter('comment_text_rss', 'wp_staticize_emoji');
  remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
}
add_action('init', 'disable_emoji');


// 管理画面のファビコン設定する
function admin_favicon() {
  echo '<link rel="icon" href="' . get_template_directory_uri() . '/favicon.ico">';
}
add_action('admin_head', 'admin_favicon');
add_action('login_head', 'admin_favicon');
