<?php get_header(); ?>
  <?php get_template_part('template-parts/subpage-header'); ?>
  
  <main id="main" class="container u-bg-product">
    <section>
      <div class="l-outer">
        <div class="l-inner">
          
          <div class="page_404_outer">
            
            <div class="page_404_content_wrap u-border_content_outline">
              <h1 class="page_404-head">
                ページが見つかりませんでした
                <span class="u-en">404 File Not Found</span>
              </h1>
              <dl class="error_url u-inline_block_parent u-border_bright_gray">
                <dt class="u-inline_block u-inline_block_child c-icon u-bg_deep_blue u-en">URL</dt>
                <dd class="u-inline_block u-inline_block_child"><?= get_pagenum_link(); ?></dd>
              </dl>
              
              <p class="error_text">
                お探しのページは、一時的にアクセスできない状態か、ページが移動・削除された可能性があります。<br>
                また、URLが間違っている可能性もありますので、もう一度URLをご確認ください。
              </p>
            </div>
            
            <a class="to_top_page c-btn c-btn-right_arrow u-bg_dark_gray" href="<?= home_url(); ?>">TOPページへ</a>
            
          </div>
          
        </div>
      </div>
    </section>
  </main>
  
<?php get_footer(); ?>
