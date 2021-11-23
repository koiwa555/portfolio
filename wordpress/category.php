  <?php get_header(); ?>
  <?php get_template_part('template-parts/subpage-header'); ?>
  
  <main id="main" class="container u-bg-product">
    <div class="l-outer breadcrumb_outer">
      <div class="l-inner">
      <?php get_template_part('template-parts/breadcrumb'); ?>
      </div>
    </div>
    
    <?php
    // インクルード先で必要な値を連想配列の形式で格納する
    $tpl_args = array(
      'slug' => get_query_var('category_name'),             // スラッグ名
      'name' => single_term_title('', false),               // カテゴリ名 (タクソノミー名)
      'children_id' => get_term_children($cat, 'category'), // 子カテゴリ一覧 (ID 指定で取得)
    );
    
    get_template_part('template-parts/loop-category-section', null, $tpl_args);
    ?>
  </main>
  
  <div id="toTopCircleOuter" class="p-to_top-circle-outer">
    <div class="p-to_top-circle-wrap">
      <a id="toTopCircle" class="p-to_top-circle c-btn_circle c-btn_circle-up_arrow u-bg_dark_gray" href="#"></a>
    </div>
  </div>
  <?php get_footer(); ?>